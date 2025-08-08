import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import TextArea from "@/components/atoms/TextArea";
import AutoSaveIndicator from "@/components/molecules/AutoSaveIndicator";
import { useDebounce } from "@/hooks/useDebounce";

const QuestionCard = ({ question, initialValue = "", onSave, className }) => {
  const [answer, setAnswer] = useState(initialValue);
  const [saveStatus, setSaveStatus] = useState("saved");
  const debouncedAnswer = useDebounce(answer, 2000);

  useEffect(() => {
    setAnswer(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (debouncedAnswer !== initialValue && debouncedAnswer.trim() !== "") {
      setSaveStatus("saving");
      onSave(question.Id, debouncedAnswer)
        .then(() => {
          setSaveStatus("saved");
        })
        .catch(() => {
          setSaveStatus("error");
        });
    }
  }, [debouncedAnswer, question.Id, onSave, initialValue]);

  const handleChange = (e) => {
    setAnswer(e.target.value);
    if (saveStatus === "saved") {
      setSaveStatus("saving");
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-gray-900 pr-4">
          {question.text}
        </h3>
        <AutoSaveIndicator status={saveStatus} />
      </div>
      
      <TextArea
        value={answer}
        onChange={handleChange}
        placeholder="Share your thoughts..."
        rows={4}
        className="resize-none"
      />
    </Card>
  );
};

export default QuestionCard;