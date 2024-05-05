import Cute from "../../../public/cute.jpg";

import Image from "next/image";

export default function HeaderChat({
  username,
}: {
  username: string | undefined;
}) {
  return (
    <div className="flex px-6 py-3 items-center gap-2 border-b-2 border-c9">
      <Image
        src={Cute}
        alt="Foto do usuário"
        className="w-12 h-12 rounded-full"
      />
      <h2 className="text-xl">{username}</h2>
    </div>
  );
}
