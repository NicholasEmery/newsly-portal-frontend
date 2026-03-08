import { BiCommentDetail } from "react-icons/bi";

interface CommentsCountProps {
  commentCount: number;
}

const Comments = ({ commentCount }: CommentsCountProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-1">
      <BiCommentDetail className="text-[clamp(0.7rem,0.6vw,0.8rem)]" />
      <p className="font-medium! text-[clamp(0.7rem,0.6vw,0.8rem)]">
        <span className="mr-0.5 font-medium! text-[clamp(0.7rem,0.6vw,0.8rem)]">
          {commentCount}
        </span>
        comments
      </p>
    </div>
  );
};

export default Comments;
