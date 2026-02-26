interface CommonMisconceptionProps {
  myth: string;
  reality: string;
}

export function CommonMisconception({ myth, reality }: CommonMisconceptionProps) {
  return (
    <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4" role="note">
      <div className="space-y-2">
        <div>
          <span className="text-sm font-semibold text-red-800">
            Common misconception:
          </span>
          <p className="text-sm text-red-700 italic">&ldquo;{myth}&rdquo;</p>
        </div>
        <div>
          <span className="text-sm font-semibold text-green-800">
            What actually happens:
          </span>
          <p className="text-sm text-green-700">{reality}</p>
        </div>
      </div>
    </div>
  );
}
