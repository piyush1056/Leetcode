import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tag,
  Briefcase,
  Lightbulb,
  ThumbsUp,
  Star,
  MessageSquare,
  Lock,
  Bookmark,
  Plus,
  Trash2
} from 'lucide-react';
import {
  toggleLikeAsync,
  toggleFavouriteAsync,
  toggleBookmarkAsync
} from '../../../redux/slices/problemSlice';
import { toast } from 'sonner';

const DescriptionTab = ({ problem }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  /* ------------------ STATES ------------------ */
  const [likes, setLikes] = useState(problem.likes || 0);
  const [isLiked, setIsLiked] = useState(user?.likedProblems?.includes(problem._id));
  const [isFavourite, setIsFavourite] = useState(user?.favouriteProblems?.includes(problem._id));
  const [isBookmarked, setIsBookmarked] = useState(user?.bookmarkedProblems?.includes(problem._id));

  /* ------------------ EFFECTS ------------------ */
  useEffect(() => {
    setLikes(problem.likes || 0);
  }, [problem._id]);

  useEffect(() => {
    setIsLiked(user?.likedProblems?.includes(problem._id) || false);
    setIsFavourite(user?.favouriteProblems?.includes(problem._id) || false);
    setIsBookmarked(user?.bookmarkedProblems?.includes(problem._id) || false);
  }, [
    problem._id,
    user?.likedProblems,
    user?.favouriteProblems,
    user?.bookmarkedProblems
  ]);

  const handleLike = () => {
    if (!user) return toast.error('Please login to like problems');
    const next = !isLiked;
    setIsLiked(next);
    setLikes(p => (next ? p + 1 : p - 1));
    dispatch(toggleLikeAsync({ problemId: problem._id, isLiked }));
  };

  const handleFavourite = () => {
    if (!user) return toast.error('Please login to favourite problems');
    setIsFavourite(p => !p);
    dispatch(toggleFavouriteAsync({ problemId: problem._id, isFavourite }));
  };

  const getDifficultyColor = diff => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'text-emerald-500 bg-emerald-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      case 'super-hard': return 'text-pink-500 bg-pink-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPoints = diff => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      case 'super-hard': return 50;
      default: return 0;
    }
  };

  return (
    <div className="flex flex-col h-full relative">

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 pb-16">

        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>{problem.problemNo && `${problem.problemNo}.`}</span>
              <span>{problem.title}</span>
            </h1>

            {/* Bookmark Dropdown - UPDATED UI */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`btn btn-ghost btn-sm btn-square ${isBookmarked ? 'text-primary' : 'text-base-content/40'}`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </div>
              
              <ul tabIndex={0} className="dropdown-content z-[50] menu p-3 shadow-2xl bg-base-100 rounded-2xl w-72 border border-base-300 mt-2">
                <li onClick={() => {
                  if (document.activeElement) document.activeElement.blur();
                  dispatch(toggleBookmarkAsync({ problemId: problem._id }));
                }}>
                  <a className="font-medium py-3 rounded-xl">Add to "My Problems"</a>
                </li>
                
                <div className="divider my-1 px-2 text-[10px] uppercase opacity-40 font-bold tracking-widest">or</div>
                
                <div className="p-2">
                  <label className="label py-0 mb-2">
                    <span className="label-text-alt font-semibold opacity-70">Custom List</span>
                  </label>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const name = e.target.elements.customName.value.trim();
                      if (!name) return;

                      const action = e.nativeEvent.submitter.value;

                      try {
                        const result = await dispatch(toggleBookmarkAsync({ problemId: problem._id, bookmarkName: name })).unwrap();

                        if (action === "add" && !result.isAdded) {
                          await dispatch(toggleBookmarkAsync({ problemId: problem._id, bookmarkName: name }));
                          toast.success(`Added to "${name}"`);
                        } else if (action === "remove" && result.isAdded) {
                          await dispatch(toggleBookmarkAsync({ problemId: problem._id, bookmarkName: name }));
                          toast.success(`Removed from "${name}"`);
                        } else {
                          toast.success(result.isAdded ? `Added to "${name}"` : `Removed from "${name}"`);
                        }
                      } catch (err) {
                        console.error("Bookmark action failed", err);
                      }

                      e.target.reset();
                      if (document.activeElement) document.activeElement.blur();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      name="customName"
                      type="text"
                      placeholder="List name..."
                      className="input input-bordered input-sm flex-1 rounded-lg text-xs focus:outline-primary/30"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      value="add"
                      className="btn btn-sm btn-success btn-square rounded-lg"
                      title="Add to list"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                    <button
                      type="submit"
                      value="remove"
                      className="btn btn-sm btn-error btn-square rounded-lg"
                      title="Remove from list"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </form>
                </div>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>

            <span className="px-2.5 py-0.5 rounded-full font-medium text-purple-500 bg-purple-500/10">
              Points: +{getPoints(problem.difficulty)}
            </span>

            <span className="text-base-content/60">
              Acceptance: <span className="font-medium">{problem.acceptance}%</span>
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="prose prose-sm max-w-none text-base-content/90 leading-relaxed">
          <p className="whitespace-pre-line">{problem.description}</p>
        </div>

        {/* EXAMPLES  */}
        {problem.examples?.length > 0 && (
          <div className="mt-8 space-y-6">
            {problem.examples.map((ex, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-sm tracking-wide font-bold text-base-content">
                  Example {idx + 1}:
                </p>
                <div className="bg-base-200/50 rounded-xl p-4 border border-base-300">
                  <div className="font-mono text-sm space-y-1">
                    <div>
                      <span className="text-base-content/70 font-medium">Input:</span> {ex.input}
                    </div>
                    <div>
                      <span className="text-base-content/70 font-medium">Output:</span> {ex.output}
                    </div>
                    {ex.explanation && (
                      <div className="pt-1 text-base-content/80">
                        <span className="text-base-content/60">Explanation:</span> {ex.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONSTRAINTS */}
        {problem.constraints?.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-sm mb-3">Constraints:</h3>
            <ul className="space-y-2">
              {problem.constraints.map((c, i) => (
                <li
                  key={i}
                  className="text-[14px] font-mono text-base-content/80 flex gap-2"
                >
                  <span className="opacity-50">•</span> <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* META COLLAPSE   */}
        <div className="mt-8 border-t border-base-300 pt-4 space-y-2">

          {/* Topics */}
          <div className="collapse collapse-arrow bg-base-200/30 rounded-2xl">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-2 text-sm font-medium py-2 min-h-[2.5rem]">
              <Tag className="w-4 h-4" />
              Topics
            </div>
            <div className="collapse-content pt-2">
              <div className="flex flex-wrap gap-2">
                {problem.tags?.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium
                    bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="collapse collapse-arrow bg-base-200/30 rounded-2xl">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-2 text-sm font-medium py-2 min-h-[2.5rem]">
              <Briefcase className="w-4 h-4" />
              Companies
              <Lock className="w-3 h-3 ml-auto opacity-50" />
            </div>
            <div className="collapse-content pt-2">
              <div className="flex flex-wrap gap-2">
                {problem.companies?.map(comp => (
                  <span
                    key={comp}
                    className="px-3 py-1 rounded-full text-xs
                    bg-base-200/70 border border-base-300"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hints */}
          {problem.hints?.length > 0 && (
            <div className="collapse collapse-arrow bg-base-200/30 rounded-2xl">
              <input type="checkbox" />
              <div className="collapse-title flex items-center gap-2 text-sm font-medium py-2 min-h-[2.5rem]">
                <Lightbulb className="w-4 h-4 text-warning" />
                Hints
              </div>
              <div className="collapse-content pt-2 space-y-2">
                {problem.hints.map((hint, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-warning/5 border border-warning/20 p-3 text-sm"
                  >
                    {hint}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER (UNCHANGED)  */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-base-100 border-t border-base-300 px-4 flex items-center gap-6">
        <button
          onClick={handleLike}
          className={`btn btn-ghost btn-sm btn-square ${
            isLiked ? 'text-primary' : 'text-base-content/60'
          }`}
        >
          <ThumbsUp className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleFavourite}
          className={`btn btn-ghost btn-sm btn-square ${
            isFavourite ? 'text-warning' : 'text-base-content/60'
          }`}
        >
          <Star className={`w-4.5 h-4.5 ${isFavourite ? 'fill-current' : ''}`} />
        </button>

        <button className="btn btn-ghost btn-sm btn-square text-base-content/60">
          <MessageSquare className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};

export default DescriptionTab;
