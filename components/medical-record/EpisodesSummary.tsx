"use client";

import React, { FunctionComponent } from "react";
import { dateFormat } from "@/utils/timeFormatting";
import Severity from "../common/Severity/Severity";
import { Loader } from "lucide-react";
import { useEpisode } from "@/hooks/episode/use-episode";
import { Episode } from "@/types/episode.types";
import { convertIntensityToSeverity } from "@/utils/convertIntensityToSeverity";

type Props = {
  clientId: number;
  count?: number;
};

const EpisodesSummary: FunctionComponent<Props> = ({ clientId, count }) => {
  const {
    episodes: data,
    isLoading,
    error,
  } = useEpisode(clientId, {
    page: 1,
    page_size: count || 5,
  });
  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-600">
        Een fout heeft ons verhinderd gegevens te laden.
      </div>
    );

  if (!data) return <div>Geen gegevens opgehaald.</div>;

  if (data.results?.length === 0)
    return <div>No recorded episode for client</div>;
  return (
    <ul className="flex flex-col gap-2">
      {data.results?.map((episode) => {
        return <EpisodesItem key={episode.id} episode={episode} />;
      })}
    </ul>
  );
};

export default EpisodesSummary;

type EmotionalStateItemProps = {
  episode: Episode;
};

const EpisodesItem: FunctionComponent<EmotionalStateItemProps> = ({
  episode,
}) => {
  return (
    <li className="grid grid-cols-3 px-4 py-4 cursor-pointer hover:bg-gray-3 dark:hover:bg-slate-700 items-center rounded-2xl">
      <div>{dateFormat(episode.date)}</div>
      <div className="flex items-center justify-center">
        <Severity severity={convertIntensityToSeverity(episode.intensity)} />
      </div>
      <div>{episode.state_description}</div>
    </li>
  );
};
