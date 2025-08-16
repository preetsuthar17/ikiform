import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

export function FeatureOne() {
  return (
    <section
      className="mx-auto w-full max-w-7xl bg-background px-4 lg:h-[55rem]"
      id="features"
    >
      <div className="mx-auto flex h-full w-full flex-col">
        <div className="relative h-full overflow-hidden rounded-4xl bg-card p-6 py-10 md:p-12 md:py-16">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col gap-6">
              <p className="text-center text-base text-muted-foreground md:text-lg">
                Fastest Form Builder
              </p>
              <h2 className="font-geist text-3xl text-foreground md:text-4xl">
                AI Powered Form Builder
              </h2>
              <Button
                asChild
                className="mx-auto w-full rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit"
                variant="secondary"
              >
                <Link
                  className="flex items-center gap-2 font-medium"
                  href="https://x.com/preetsuthar17/status/1941017691848167747"
                  target="_blank"
                >
                  Check Out Demo <ChevronRight />
                </Link>
              </Button>
            </div>
            <div className="md:-translate-x-1/2 relative aspect-video w-full max-w-full translate-y-[20px] overflow-hidden rounded-4xl border md:absolute md:top-[29%] md:left-1/2 md:max-w-[90%]">
              <Image
                alt="AI Powered Form Builder"
                className="object-cover"
                height={1080}
                quality={100}
                src="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignfJjJYxa3obyWxJCaFlVO6zhMk0rpTSDi5EQf"
                width={1920}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureTwo() {
  return (
    <section className="mx-auto w-full max-w-7xl bg-background px-4 md:h-[35rem]">
      <div className="mx-auto flex h-full w-full flex-col">
        <div className="relative h-full overflow-hidden rounded-4xl bg-card p-6 py-10 md:p-12 md:py-16">
          <div className="flex flex-col gap-8 text-left">
            <div className="flex flex-col gap-2">
              <h2 className="font-geist font-medium text-3xl text-foreground">
                {' '}
                Intuitive Form Builder{' '}
              </h2>{' '}
              <p className="max-w-sm text-left text-muted-foreground">
                {' '}
                Drag and drop to create beautiful forms. Customize fields,
                layout, and design with ease.{' '}
              </p>
            </div>

            {/* Feature list */}
            <div className="flex flex-col gap-4">
              {[
                'Multi-step & single form modes',
                'Collect signature',
                'Field-specific settings',
                'Form customization',
              ].map((text, i) => (
                <p className="flex items-center gap-2" key={i}>
                  <span className="opacity-90">
                    {' '}
                    <svg
                      height="22"
                      viewBox="0 0 20 20"
                      width="22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {' '}
                      <path
                        d="m8.46 1.897l.99.39a1.5 1.5 0 0 0 1.099 0l.99-.39a2.42 2.42 0 0 1 3.102 1.285l.424.975a1.5 1.5 0 0 0 .777.777l.975.424a2.42 2.42 0 0 1 1.285 3.103l-.39.99a1.5 1.5 0 0 0 0 1.098l.39.99a2.42 2.42 0 0 1-1.285 3.102l-.975.424a1.5 1.5 0 0 0-.777.777l-.424.975a2.42 2.42 0 0 1-3.103 1.285l-.99-.39a1.5 1.5 0 0 0-1.098 0l-.99.39a2.42 2.42 0 0 1-3.102-1.285l-.424-.975a1.5 1.5 0 0 0-.777-.777l-.975-.424a2.42 2.42 0 0 1-1.285-3.103l.39-.99a1.5 1.5 0 0 0 0-1.098l-.39-.99a2.42 2.42 0 0 1 1.285-3.102l.975-.424a1.5 1.5 0 0 0 .777-.777l.424-.975a2.42 2.42 0 0 1 3.103-1.285m4.166 5.77l-3.648 4.104l-1.625-1.625a.5.5 0 0 0-.707.707l2 2a.5.5 0 0 0 .727-.021l4-4.5a.5.5 0 0 0-.747-.665"
                        fill="currentColor"
                      />{' '}
                    </svg>{' '}
                  </span>
                  {text}
                </p>
              ))}
            </div>

            {/* Button */}
            <Button
              asChild
              className="w-full rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit"
              variant="secondary"
            >
              <Link
                className="flex items-center gap-2 font-medium"
                href="/demo-form-builder"
              >
                Try Form Builder Demo <ChevronRight />
              </Link>
            </Button>

            {/* Image container */}
            <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-4xl border md:absolute md:top-[15%] md:left-[40%] md:max-w-[70%]">
              <Image
                alt="Intuitive Form Builder"
                className="object-cover"
                height={1080}
                quality={100}
                src="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignW2A276NjimtbxV47kdJraHT8zg0GEf6yRWqo"
                width={1920}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureThree() {
  return (
    <section className="mx-auto w-full max-w-7xl bg-background px-4 md:h-[35rem]">
      <div className="mx-auto flex h-full w-full flex-col">
        <div className="relative h-full overflow-hidden rounded-4xl bg-card p-6 py-10 md:p-12 md:py-16">
          <div className="flex flex-col gap-8 text-left md:ml-auto md:w-fit md:items-start md:justify-start">
            <div className="flex flex-col gap-2">
              <h2 className="font-geist font-medium text-3xl text-foreground">
                AI-Powered Analytics{' '}
              </h2>
              <p className="max-w-md text-left text-muted-foreground">
                Get instant insights and analytics powered by AI. Visualize
                responses and trends effortlessly.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="flex items-center gap-2">
                <span className="opacity-90">
                  <svg
                    height="22"
                    viewBox="0 0 20 20"
                    width="22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m8.46 1.897l.99.39a1.5 1.5 0 0 0 1.099 0l.99-.39a2.42 2.42 0 0 1 3.102 1.285l.424.975a1.5 1.5 0 0 0 .777.777l.975.424a2.42 2.42 0 0 1 1.285 3.103l-.39.99a1.5 1.5 0 0 0 0 1.098l.39.99a2.42 2.42 0 0 1-1.285 3.102l-.975.424a1.5 1.5 0 0 0-.777.777l-.424.975a2.42 2.42 0 0 1-3.103 1.285l-.99-.39a1.5 1.5 0 0 0-1.098 0l-.99.39a2.42 2.42 0 0 1-3.102-1.285l-.424-.975a1.5 1.5 0 0 0-.777-.777l-.975-.424a2.42 2.42 0 0 1-1.285-3.103l.39-.99a1.5 1.5 0 0 0 0-1.098l-.39-.99a2.42 2.42 0 0 1 1.285-3.102l.975-.424a1.5 1.5 0 0 0 .777-.777l.424-.975a2.42 2.42 0 0 1 3.103-1.285m4.166 5.77l-3.648 4.104l-1.625-1.625a.5.5 0 0 0-.707.707l2 2a.5.5 0 0 0 .727-.021l4-4.5a.5.5 0 0 0-.747-.665"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Specific form data
              </p>
              <p className="flex items-center gap-2">
                <span className="opacity-90">
                  <svg
                    height="22"
                    viewBox="0 0 20 20"
                    width="22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m8.46 1.897l.99.39a1.5 1.5 0 0 0 1.099 0l.99-.39a2.42 2.42 0 0 1 3.102 1.285l.424.975a1.5 1.5 0 0 0 .777.777l.975.424a2.42 2.42 0 0 1 1.285 3.103l-.39.99a1.5 1.5 0 0 0 0 1.098l.39.99a2.42 2.42 0 0 1-1.285 3.102l-.975.424a1.5 1.5 0 0 0-.777.777l-.424.975a2.42 2.42 0 0 1-3.103 1.285l-.99-.39a1.5 1.5 0 0 0-1.098 0l-.99.39a2.42 2.42 0 0 1-3.102-1.285l-.424-.975a1.5 1.5 0 0 0-.777-.777l-.975-.424a2.42 2.42 0 0 1-1.285-3.103l.39-.99a1.5 1.5 0 0 0 0-1.098l-.39-.99a2.42 2.42 0 0 1 1.285-3.102l.975-.424a1.5 1.5 0 0 0 .777-.777l.424-.975a2.42 2.42 0 0 1 3.103-1.285m4.166 5.77l-3.648 4.104l-1.625-1.625a.5.5 0 0 0-.707.707l2 2a.5.5 0 0 0 .727-.021l4-4.5a.5.5 0 0 0-.747-.665"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Estimating data
              </p>
              <p className="flex items-center gap-2">
                <span className="opacity-90">
                  <svg
                    height="22"
                    viewBox="0 0 20 20"
                    width="22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m8.46 1.897l.99.39a1.5 1.5 0 0 0 1.099 0l.99-.39a2.42 2.42 0 0 1 3.102 1.285l.424.975a1.5 1.5 0 0 0 .777.777l.975.424a2.42 2.42 0 0 1 1.285 3.103l-.39.99a1.5 1.5 0 0 0 0 1.098l.39.99a2.42 2.42 0 0 1-1.285 3.102l-.975.424a1.5 1.5 0 0 0-.777.777l-.424.975a2.42 2.42 0 0 1-3.103 1.285l-.99-.39a1.5 1.5 0 0 0-1.098 0l-.99.39a2.42 2.42 0 0 1-3.102-1.285l-.424-.975a1.5 1.5 0 0 0-.777-.777l-.975-.424a2.42 2.42 0 0 1-1.285-3.103l.39-.99a1.5 1.5 0 0 0 0-1.098l-.39-.99a2.42 2.42 0 0 1 1.285-3.102l.975-.424a1.5 1.5 0 0 0 .777-.777l.424-.975a2.42 2.42 0 0 1 3.103-1.285m4.166 5.77l-3.648 4.104l-1.625-1.625a.5.5 0 0 0-.707.707l2 2a.5.5 0 0 0 .727-.021l4-4.5a.5.5 0 0 0-.747-.665"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Predicting trends
              </p>
              <p className="flex items-center gap-2">
                <span className="opacity-90">
                  <svg
                    height="22"
                    viewBox="0 0 20 20"
                    width="22"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m8.46 1.897l.99.39a1.5 1.5 0 0 0 1.099 0l.99-.39a2.42 2.42 0 0 1 3.102 1.285l.424.975a1.5 1.5 0 0 0 .777.777l.975.424a2.42 2.42 0 0 1 1.285 3.103l-.39.99a1.5 1.5 0 0 0 0 1.098l.39.99a2.42 2.42 0 0 1-1.285 3.102l-.975.424a1.5 1.5 0 0 0-.777.777l-.424.975a2.42 2.42 0 0 1-3.103 1.285l-.99-.39a1.5 1.5 0 0 0-1.098 0l-.99.39a2.42 2.42 0 0 1-3.102-1.285l-.424-.975a1.5 1.5 0 0 0-.777-.777l-.975-.424a2.42 2.42 0 0 1-1.285-3.103l.39-.99a1.5 1.5 0 0 0 0-1.098l-.39-.99a2.42 2.42 0 0 1 1.285-3.102l.975-.424a1.5 1.5 0 0 0 .777-.777l.424-.975a2.42 2.42 0 0 1 3.103-1.285m4.166 5.77l-3.648 4.104l-1.625-1.625a.5.5 0 0 0-.707.707l2 2a.5.5 0 0 0 .727-.021l4-4.5a.5.5 0 0 0-.747-.665"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Filtering dummy/spam responses
              </p>
            </div>

            <Button
              asChild
              className="w-full rounded-full border border-[0.5px] px-7 py-6 hover:brightness-99 md:w-fit"
              variant="secondary"
            >
              <Link
                className="flex items-center gap-2 font-medium"
                href="https://x.com/preetsuthar17/status/1941017691848167747"
                target="_blank"
              >
                Kiko AI <ChevronRight />
              </Link>
            </Button>

            {/* Image container */}
            <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-4xl border md:absolute md:top-[12%] md:right-[45%] md:h-full md:w-full md:max-w-[50%]">
              <Image
                alt="AI-Powered Analytics"
                className="object-cover"
                height={1080}
                quality={100}
                src="https://av5on64jc4.ufs.sh/f/jYAIyA6pXignapAseOUNZ0hrJF81gqexS3XoW5nYkRTuljHE"
                width={1920}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
