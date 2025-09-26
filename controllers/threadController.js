const { Board, Thread } = require('./database');

class ThreadController {
  // Create a new thread
  static async createThread(boardName, text, delete_password) {
    try {
      const newThread = new Thread({
        text: text,
        delete_password: delete_password,
        replies: []
      });

      // Find or create board
      let boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        // Create new board
        const newBoard = new Board({
          name: boardName,
          threads: []
        });
        newBoard.threads.push(newThread);
        const savedBoard = await newBoard.save();
        return newThread;
      } else {
        // Add thread to existing board
        boardData.threads.push(newThread);
        await boardData.save();
        return newThread;
      }
    } catch (error) {
      throw error;
    }
  }

  // Get most recent 10 threads with 3 most recent replies each
  static async getRecentThreads(boardName) {
    try {
      const boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        return [];
      }

      // Sort threads by bumped_on descending, limit to 10
      const sortedThreads = boardData.threads
        .sort((a, b) => new Date(b.bumped_on) - new Date(a.bumped_on))
        .slice(0, 10);

      return sortedThreads.map(thread => {
        // Sort replies by created_on descending, limit to 3
        const recentReplies = thread.replies
          .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
          .slice(0, 3)
          .map(reply => ({
            _id: reply._id,
            text: reply.text,
            created_on: reply.created_on
          }));

        return {
          _id: thread._id,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          replies: recentReplies,
          replycount: thread.replies.length
        };
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete a thread
  static async deleteThread(boardName, thread_id, delete_password) {
    try {
      const boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        return 'incorrect password';
      }
      
      const threadToDelete = boardData.threads.id(thread_id);
      
      if (!threadToDelete) {
        return 'incorrect password';
      }
      
      if (threadToDelete.delete_password !== delete_password) {
        return 'incorrect password';
      }
      
      // Use pull instead of remove for Mongoose 6+
      boardData.threads.pull(thread_id);
      await boardData.save();
      return 'success';
    } catch (error) {
      return 'incorrect password';
    }
  }

  // Report a thread
  static async reportThread(boardName, thread_id) {
    try {
      const boardData = await Board.findOne({ name: boardName });
      
      if (!boardData) {
        throw new Error('Board not found');
      }
      
      const reportedThread = boardData.threads.id(thread_id);
      
      if (!reportedThread) {
        throw new Error('Thread not found');
      }
      
      reportedThread.reported = true;
      reportedThread.bumped_on = new Date();
      await boardData.save();
      return 'reported';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ThreadController;