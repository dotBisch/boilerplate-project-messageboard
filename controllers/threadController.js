const { Thread } = require('./database');

class ThreadController {
  // Create a new thread
  static async createThread(board, text, delete_password) {
    try {
      const now = new Date();
      const thread = new Thread({
        board,
        text,
        delete_password,
        created_on: now,
        bumped_on: now, // bumped_on starts same as created_on
        replies: []
      });
      
      const savedThread = await thread.save();
      return savedThread;
    } catch (error) {
      throw error;
    }
  }

  // Get most recent 10 threads with 3 most recent replies each
  static async getRecentThreads(board) {
    try {
      const threads = await Thread.find({ board })
        .sort({ bumped_on: -1 })
        .limit(10)
        .lean();

      return threads.map(thread => ({
        _id: thread._id,
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        replies: thread.replies
          .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
          .slice(0, 3)
          .map(reply => ({
            _id: reply._id,
            text: reply.text,
            created_on: reply.created_on
          }))
      }));
    } catch (error) {
      throw error;
    }
  }

  // Delete a thread
  static async deleteThread(board, thread_id, delete_password) {
    try {
      const thread = await Thread.findOne({ _id: thread_id, board });
      
      if (!thread) {
        return 'incorrect password';
      }
      
      if (thread.delete_password !== delete_password) {
        return 'incorrect password';
      }
      
      await Thread.deleteOne({ _id: thread_id });
      return 'success';
    } catch (error) {
      return 'incorrect password';
    }
  }

  // Report a thread
  static async reportThread(board, thread_id) {
    try {
      await Thread.updateOne(
        { _id: thread_id, board },
        { reported: true }
      );
      return 'reported';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ThreadController;