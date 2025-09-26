const { Board, Reply } = require('./database');

class ReplyController {
  // Create a new reply
  static async createReply(boardName, thread_id, text, delete_password) {
    try {
      const boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        throw new Error('Board not found');
      }

      const threadToAddReply = boardData.threads.id(thread_id);
      
      if (!threadToAddReply) {
        throw new Error('Thread not found');
      }

      // Create reply object with all required fields
      const date = new Date();
      const newReply = {
        text: text,
        delete_password: delete_password,
        created_on: date,
        reported: false
      };

      threadToAddReply.bumped_on = date;
      threadToAddReply.replies.push(newReply);
      
      const updatedData = await boardData.save();
      return threadToAddReply;
    } catch (error) {
      throw error;
    }
  }

  // Get a single thread with all replies
  static async getThreadWithReplies(boardName, thread_id) {
    try {
      const boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        throw new Error('Board not found');
      }

      const thread = boardData.threads.id(thread_id);
      
      if (!thread) {
        throw new Error('Thread not found');
      }

      return {
        _id: thread._id,
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        replies: thread.replies.map(reply => ({
          _id: reply._id,
          text: reply.text,
          created_on: reply.created_on
        }))
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete a reply
  static async deleteReply(boardName, thread_id, reply_id, delete_password) {
    try {
      const boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        return 'incorrect password';
      }

      const thread = boardData.threads.id(thread_id);
      
      if (!thread) {
        return 'incorrect password';
      }

      const reply = thread.replies.id(reply_id);
      
      if (!reply) {
        return 'incorrect password';
      }

      if (reply.delete_password !== delete_password) {
        return 'incorrect password';
      }

      // Change the reply text to [deleted] instead of removing it
      reply.text = '[deleted]';
      await boardData.save();
      return 'success';
    } catch (error) {
      return 'incorrect password';
    }
  }

  // Report a reply
  static async reportReply(boardName, thread_id, reply_id) {
    try {
      const boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        return 'error';
      }

      const thread = boardData.threads.id(thread_id);
      
      if (!thread) {
        return 'error';
      }

      const reply = thread.replies.id(reply_id);
      
      if (!reply) {
        return 'error';
      }

      reply.reported = true;
      reply.bumped_on = new Date();
      await boardData.save();
      return 'reported';
    } catch (error) {
      return 'error';
    }
  }
}

module.exports = ReplyController;