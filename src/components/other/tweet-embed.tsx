"use client";

import dynamic from "next/dynamic";

const Tweet = dynamic(async () => (await import("react-tweet")).Tweet, {
	ssr: false,
});

interface TweetEmbedProps {
	tweetId: string;
}

export function TweetEmbed({ tweetId }: TweetEmbedProps) {
	return <Tweet id={tweetId} />;
}
