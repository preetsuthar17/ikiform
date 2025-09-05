"use client";

import { FeatureIntroduction } from "@/components/ui/feature-introduction";
import { TweetEmbed } from "@/components/other/tweet-embed";

export function ApiSupportIntroduction() {
  return (
    <FeatureIntroduction
      id="api-support-feature"
      delay={5000}
      title="🚀 Introducing API Support!"
      description="Instead of building forms pages, you can create a form endpoint and hit that directly with your data."
      className="max-w-fit w-full "
      showAction={false}
    >
      <div className="w-full mx-auto">
        <TweetEmbed tweetId="1963893354896179683" />
      </div>
    </FeatureIntroduction>
  );
}
