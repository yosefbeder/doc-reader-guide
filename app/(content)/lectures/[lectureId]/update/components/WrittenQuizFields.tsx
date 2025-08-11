import Input from "@/components/Input";
import { WrittenQuiz } from "@/types";

const WrittenQuizFields = ({
  lectureId,
  defaultValues,
  formId,
}: {
  lectureId: number;
  defaultValues?: WrittenQuiz;
  formId?: string;
}) => {
  return (
    <div>
      {defaultValues && (
        <input
          type="number"
          name="quiz-id"
          id={`quiz-${defaultValues?.id || "new"}-id`}
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="Title"
        icon="book-open"
        type="text"
        name="title"
        id={`quiz-${defaultValues?.id || "new"}-title`}
        required
        defaultValue={defaultValues?.title}
        className="mb-4"
        form={formId}
      />
      <input
        type="number"
        id={`quiz-${defaultValues?.id || "new"}-lecture-id`}
        name="lecture-id"
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
    </div>
  );
};

export default WrittenQuizFields;
