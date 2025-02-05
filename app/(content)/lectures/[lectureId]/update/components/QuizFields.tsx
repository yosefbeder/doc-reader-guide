import Input from "@/components/Input";
import { Quiz } from "@/types";

const QuizFields = ({
  lectureId,
  defaultValues,
  formId,
}: {
  lectureId: number;
  defaultValues?: Quiz;
  formId?: string;
}) => {
  return (
    <div>
      {defaultValues && (
        <input
          type="number"
          id="quiz-id"
          name="quiz-id"
          className="hidden"
          defaultValue={defaultValues.id}
          form={formId}
        />
      )}
      <Input
        label="العنوان"
        icon="book-open"
        type="text"
        id="title"
        name="title"
        required
        defaultValue={defaultValues?.title}
        className="mb-4"
        form={formId}
      />
      <input
        type="number"
        id="lecture-id"
        name="lecture-id"
        className="hidden"
        defaultValue={lectureId}
        form={formId}
      />
    </div>
  );
};

export default QuizFields;
