from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from uuid import uuid4

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api")

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'zentiam_db')]

# ==================== MODELS ====================

class FeedbackRequest(BaseModel):
    session_id: str
    message_index: int
    feedback_type: str  # 'positive', 'negative'
    detailed_feedback: Optional[str] = None

class ApprovedAnswerRequest(BaseModel):
    question_pattern: str
    approved_answer: str
    context_tags: Optional[List[str]] = []

class ApprovedAnswerUpdate(BaseModel):
    question_pattern: Optional[str] = None
    approved_answer: Optional[str] = None
    context_tags: Optional[List[str]] = None
    is_active: Optional[bool] = None

# ==================== FEEDBACK ENDPOINTS ====================

@router.post("/chatbot/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """Submit feedback for a bot response"""
    try:
        # Get session to extract the Q&A pair
        session = await db.chat_sessions.find_one({"session_id": feedback.session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        messages = session.get("messages", [])
        if feedback.message_index >= len(messages):
            raise HTTPException(status_code=400, detail="Invalid message index")
        
        # Get the bot message and preceding user message
        bot_message = messages[feedback.message_index]
        user_message = messages[feedback.message_index - 1] if feedback.message_index > 0 else None
        
        # Create feedback record
        feedback_record = {
            "id": str(uuid4()),
            "session_id": feedback.session_id,
            "message_index": feedback.message_index,
            "user_message": user_message.get("message", "") if user_message else "",
            "bot_response": bot_message.get("message", ""),
            "feedback_type": feedback.feedback_type,
            "detailed_feedback": feedback.detailed_feedback,
            "created_at": datetime.utcnow()
        }
        
        await db.feedback.insert_one(feedback_record)
        
        # Update session with feedback info
        await db.chat_sessions.update_one(
            {"session_id": feedback.session_id},
            {
                "$set": {f"messages.{feedback.message_index}.feedback": feedback.feedback_type},
                "$inc": {
                    "positive_feedback_count" if feedback.feedback_type == "positive" else "negative_feedback_count": 1
                }
            }
        )
        
        # If negative feedback, add to learning queue for review
        if feedback.feedback_type == "negative":
            await db.learning_queue.insert_one({
                "id": str(uuid4()),
                "type": "negative_feedback",
                "session_id": feedback.session_id,
                "user_question": user_message.get("message", "") if user_message else "",
                "bot_response": bot_message.get("message", ""),
                "detailed_feedback": feedback.detailed_feedback,
                "status": "pending",
                "created_at": datetime.utcnow()
            })
        
        return {"success": True, "message": "Feedback recorded"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chatbot/feedback/{session_id}")
async def get_session_feedback(session_id: str):
    """Get all feedback for a session"""
    try:
        feedback_list = await db.feedback.find(
            {"session_id": session_id}
        ).to_list(100)
        
        for f in feedback_list:
            f.pop("_id", None)
        
        return {"feedback": feedback_list}
    except Exception as e:
        logger.error(f"Error getting feedback: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== APPROVED ANSWERS ====================

@router.get("/admin/approved-answers")
async def get_approved_answers(skip: int = 0, limit: int = 50):
    """Get all approved answers"""
    try:
        answers = await db.approved_answers.find(
            {}, {"_id": 0}
        ).skip(skip).limit(limit).to_list(limit)
        
        total = await db.approved_answers.count_documents({})
        
        return {"answers": answers, "total": total}
    except Exception as e:
        logger.error(f"Error getting approved answers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/approved-answers")
async def create_approved_answer(answer: ApprovedAnswerRequest):
    """Create a new approved answer"""
    try:
        answer_record = {
            "id": str(uuid4()),
            "question_pattern": answer.question_pattern,
            "approved_answer": answer.approved_answer,
            "context_tags": answer.context_tags or [],
            "usage_count": 0,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.approved_answers.insert_one(answer_record)
        answer_record.pop("_id", None)
        
        return {"success": True, "answer": answer_record}
    except Exception as e:
        logger.error(f"Error creating approved answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/admin/approved-answers/{answer_id}")
async def update_approved_answer(answer_id: str, update: ApprovedAnswerUpdate):
    """Update an approved answer"""
    try:
        update_data = {k: v for k, v in update.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.approved_answers.update_one(
            {"id": answer_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Answer not found")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating approved answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/admin/approved-answers/{answer_id}")
async def delete_approved_answer(answer_id: str):
    """Delete an approved answer"""
    try:
        result = await db.approved_answers.delete_one({"id": answer_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Answer not found")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting approved answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== LEARNING QUEUE ====================

@router.get("/admin/learning-queue")
async def get_learning_queue(status: str = "pending", skip: int = 0, limit: int = 50):
    """Get items in the learning queue for review"""
    try:
        query = {"status": status} if status else {}
        items = await db.learning_queue.find(
            query, {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        total = await db.learning_queue.count_documents(query)
        
        return {"items": items, "total": total}
    except Exception as e:
        logger.error(f"Error getting learning queue: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/learning-queue/{item_id}/approve")
async def approve_learning_item(item_id: str, improved_answer: Optional[str] = None):
    """Approve a learning item and optionally create an approved answer"""
    try:
        item = await db.learning_queue.find_one({"id": item_id})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Mark as reviewed
        await db.learning_queue.update_one(
            {"id": item_id},
            {"$set": {"status": "approved", "reviewed_at": datetime.utcnow()}}
        )
        
        # If improved answer provided, create approved answer
        if improved_answer:
            answer_record = {
                "id": str(uuid4()),
                "question_pattern": item.get("user_question", ""),
                "approved_answer": improved_answer,
                "context_tags": [],
                "usage_count": 0,
                "is_active": True,
                "created_from": "learning_queue",
                "original_item_id": item_id,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.approved_answers.insert_one(answer_record)
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error approving learning item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/learning-queue/{item_id}/dismiss")
async def dismiss_learning_item(item_id: str):
    """Dismiss a learning item"""
    try:
        result = await db.learning_queue.update_one(
            {"id": item_id},
            {"$set": {"status": "dismissed", "reviewed_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error dismissing learning item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== LEARNING METRICS ====================

@router.get("/admin/learning-metrics")
async def get_learning_metrics():
    """Get learning and feedback metrics"""
    try:
        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        # Feedback stats
        total_feedback = await db.feedback.count_documents({})
        positive_feedback = await db.feedback.count_documents({"feedback_type": "positive"})
        negative_feedback = await db.feedback.count_documents({"feedback_type": "negative"})
        
        weekly_feedback = await db.feedback.count_documents({"created_at": {"$gte": week_ago}})
        weekly_positive = await db.feedback.count_documents({"feedback_type": "positive", "created_at": {"$gte": week_ago}})
        
        # Learning queue stats
        pending_reviews = await db.learning_queue.count_documents({"status": "pending"})
        approved_reviews = await db.learning_queue.count_documents({"status": "approved"})
        
        # Approved answers stats
        total_approved_answers = await db.approved_answers.count_documents({"is_active": True})
        
        # Top unanswered questions (from negative feedback)
        unanswered_pipeline = [
            {"$match": {"feedback_type": "negative", "detailed_feedback": {"$exists": True, "$ne": ""}}},
            {"$group": {"_id": "$user_message", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        unanswered_cursor = db.feedback.aggregate(unanswered_pipeline)
        top_unanswered = await unanswered_cursor.to_list(10)
        
        # Satisfaction rate
        satisfaction_rate = (positive_feedback / total_feedback * 100) if total_feedback > 0 else 0
        weekly_satisfaction = (weekly_positive / weekly_feedback * 100) if weekly_feedback > 0 else 0
        
        # Trend data (last 7 days)
        trend_data = []
        for i in range(7):
            day = now - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            
            day_positive = await db.feedback.count_documents({
                "feedback_type": "positive",
                "created_at": {"$gte": day_start, "$lt": day_end}
            })
            day_negative = await db.feedback.count_documents({
                "feedback_type": "negative",
                "created_at": {"$gte": day_start, "$lt": day_end}
            })
            
            trend_data.append({
                "date": day_start.strftime("%Y-%m-%d"),
                "positive": day_positive,
                "negative": day_negative,
                "total": day_positive + day_negative
            })
        
        return {
            "summary": {
                "total_feedback": total_feedback,
                "positive_feedback": positive_feedback,
                "negative_feedback": negative_feedback,
                "satisfaction_rate": round(satisfaction_rate, 1),
                "weekly_satisfaction_rate": round(weekly_satisfaction, 1),
                "pending_reviews": pending_reviews,
                "approved_reviews": approved_reviews,
                "total_approved_answers": total_approved_answers
            },
            "top_unanswered_questions": [
                {"question": item["_id"], "count": item["count"]} 
                for item in top_unanswered if item["_id"]
            ],
            "trend_data": list(reversed(trend_data))
        }
    except Exception as e:
        logger.error(f"Error getting learning metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))
