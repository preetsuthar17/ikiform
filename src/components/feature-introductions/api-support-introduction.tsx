"use client";

import { TweetEmbed } from "@/components/other/tweet-embed";
import { FeatureIntroduction } from "@/components/ui/feature-introduction";

export function ApiSupportIntroduction() {
  return (
    <FeatureIntroduction
      className="w-full max-w-fit"
      delay={5000}
      description="Instead of building forms pages, you can create a form endpoint and hit that directly with your data."
      id="api-support-feature"
      showAction={false}
      title="🚀 Introducing API Support!"
    >
      <div className="mx-auto w-full">
        <TweetEmbed tweetId="1963893354896179683" />
      </div>
    </FeatureIntroduction>
  );
}
