import { Dispatch } from "react";

export default function InputChat({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <input
      type="text"
      className="grow rounded-l-lg  border-2 border-c2 p-4 focus:outline-none focus:border-c1"
      value={value}
      placeholder={"Send a message"}
      onChange={(e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (target) {
          setValue(target.value);
        }
      }}
    />
  );
}
