import Session from '../models/Session.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { ErrorResponse } from '../utils/errorHandler.js';

// @desc    Get all public sessions
// @route   GET /api/sessions
// @access  Public
export const getPublicSessions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Session.countDocuments({ status: 'published', isActive: true });

  // Build query
  let query = Session.find({ status: 'published', isActive: true })
    .populate('user', 'name email')
    .sort('-createdAt');

  // Search functionality
  if (req.query.search) {
    query = query.find({
      $or: [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ]
    });
  }

  // Filter by category
  if (req.query.category) {
    query = query.find({ category: req.query.category });
  }

  // Filter by difficulty
  if (req.query.difficulty) {
    query = query.find({ difficulty: req.query.difficulty });
  }

  // Pagination
  query = query.skip(startIndex).limit(limit);

  const sessions = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: sessions.length,
    pagination,
    data: sessions
  });
});

// @desc    Get user's sessions
// @route   GET /api/sessions/my-sessions
// @access  Private
export const getMySessions = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  
  let query = { user: req.user.id };

  if (status) {
    query.status = status;
  }

  const sessions = await Session.find(query).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: sessions.length,
    data: sessions
  });
});

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
export const getSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id)
    .populate('user', 'name email')
    .populate('likes', 'name email');

  if (!session) {
    return next(new ErrorResponse('Session not found', 404));
  }

  if (session.status === 'draft' && session.user._id.toString() !== req.user?.id) {
    return next(new ErrorResponse('Session not found', 404));
  }

  // Increment views if user is authenticated
  if (req.user && session.user._id.toString() !== req.user.id) {
    session.views += 1;
    await session.save();
  }

  res.status(200).json({
    success: true,
    data: session
  });
});

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
export const createSession = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Process tags
  if (req.body.tags) {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
  }

  const session = await Session.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Session created successfully',
    data: session
  });
});

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
export const updateSession = asyncHandler(async (req, res, next) => {
  let session = await Session.findById(req.params.id);

  if (!session) {
    return next(new ErrorResponse('Session not found', 404));
  }

  // Make sure user owns session
  if (session.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this session', 401));
  }

  // Process tags
  if (req.body.tags) {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
  }

  session = await Session.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Session updated successfully',
    data: session
  });
});

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    return next(new ErrorResponse('Session not found', 404));
  }

  // Make sure user owns session
  if (session.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this session', 401));
  }

  await session.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Session deleted successfully'
  });
});

// @desc    Publish session
// @route   PUT /api/sessions/:id/publish
// @access  Private
export const publishSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    return next(new ErrorResponse('Session not found', 404));
  }

  // Make sure user owns session
  if (session.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to publish this session', 401));
  }

  session.status = 'published';
  await session.save();

  res.status(200).json({
    success: true,
    message: 'Session published successfully',
    data: session
  });
});

// @desc    Like/Unlike session
// @route   PUT /api/sessions/:id/like
// @access  Private
export const likeSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    return next(new ErrorResponse('Session not found', 404));
  }

  if (session.status !== 'published') {
    return next(new ErrorResponse('Cannot like unpublished session', 400));
  }

  const likeIndex = session.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    // Unlike
    session.likes.splice(likeIndex, 1);
  } else {
    // Like
    session.likes.push(req.user.id);
  }

  await session.save();

  res.status(200).json({
    success: true,
    message: likeIndex > -1 ? 'Session unliked' : 'Session liked',
    data: session
  });
}); 