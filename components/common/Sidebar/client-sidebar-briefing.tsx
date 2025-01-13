import dayjs from "dayjs";
import { getAge } from "@/utils/get-age";
import ProfilePicture from "../profilePicture/profile-picture";

interface ClientSidebarBriefingProps {
  clientId: number;
}

const ClientSidebarBriefing: React.FC<ClientSidebarBriefingProps> = ({ clientId:_clientId }) => {
    const data = {
        profile_picture: "https://via.placeholder.com/150",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: "1990-01-01",
        filenumber: "123456"
    }
  return (
    <div className="w-full flex flex-col font-bold items-center">
      <ProfilePicture profilePicture={data?.profile_picture} />
      <p className="pt-5 text-white">{data?.first_name + " " + data?.last_name}</p>
      <p>
        {data?.date_of_birth
          ? dayjs(data?.date_of_birth).format("DD MMM, YYYY") +
            ` (${getAge(data?.date_of_birth)} jaar oud)`
          : null}
      </p>
      <p>{"Dossiernummer : " + data?.filenumber}</p>
    </div>
  );
};

export default ClientSidebarBriefing;
