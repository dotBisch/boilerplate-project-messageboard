const { Thread } = require('./database');

class ReplyController {
  // Create a new reply
  static async createReply(board, thread_id, text, delete_password) {
    try {
      const thread = await Thread.findOne({ _id: thread_id, board });
      
      if (!thread) {
        throw new Error('Thread not found');
      }

      const replyCreatedOn = new Date();
      const reply = {
        text,
        delete_password,
        created_on: replyCreatedOn,
        reported: false
      };

      thread.replies.push(reply);
      thread.bumped_on = replyCreatedOn; // Update bumped_on to the reply's creation date
      
      const savedThread = await thread.save();
      return savedThread;
    } catch (error) {
      throw error;
    }
  }

  // Get a single thread with all replies
  static async getThreadWithReplies(board, thread_id) {
    try {
      const thread = await Thread.findOne({ _id: thread_id, board }).lean();
      
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
  static async deleteReply(board, thread_id, reply_id, delete_password) {
    try {
      const thread = await Thread.findOne({ _id: thread_id, board });
      
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

      reply.text = '[deleted]';
      await thread.save();
      return 'success';
    } catch (error) {
      return 'incorrect password';
    }
  }

  // Report a reply
  static async reportReply(board, thread_id, reply_id) {
    try {
      const thread = await Thread.findOne({ _id: thread_id, board });
      
      if (!thread) {
        throw new Error('Thread not found');
      }

      const reply = thread.replies.id(reply_id);
      
      if (!reply) {
        throw new Error('Reply not found');
      }

      reply.reported = true;
      await thread.save();
      return 'reported';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReplyController;