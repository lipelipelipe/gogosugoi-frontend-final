// src/app/anime/[slug]/page.tsx

import { getAnimeDetails, getAdPlacements } from '@/lib/api';
import AdSlot from '@/components/AdSlot';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlayCircle, Bookmark, Star, Calendar, Tv } from 'lucide-react';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

interface PageProps {
  params: {
    slug: string;
  };
}

type JsonLdSchema = Record<string, unknown>;

// =============================================================================
// SEO Metadata
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const anime = await getAnimeDetails(decodeURIComponent(slug));

  if (!anime) {
    return {
      title: 'Anime Not Found - GogoSugoi',
    };
  }

  if (anime.yoastSeo?.meta) {
    const yoastMeta = anime.yoastSeo.meta;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogosugoi.vercel.app';
    const canonicalUrl = `${siteUrl}/anime/${slug}`;

    const getMetaString = (value: unknown, fallback = ''): string =>
      typeof value === 'string' ? value : fallback;

    const getOgImage = (value: unknown): { url: string }[] => {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'object' &&
        value[0] !== null &&
        'url' in value[0] &&
        typeof value[0].url === 'string'
      ) {
        return [{ url: value[0].url }];
      }
      return [{ url: anime.coverImage || '/placeholder.png' }];
    };

    return {
      title: getMetaString(yoastMeta.title, anime.title),
      description: getMetaString(yoastMeta.description),
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: getMetaString(yoastMeta.og_title, getMetaString(yoastMeta.title, anime.title)),
        description: getMetaString(yoastMeta.og_description, getMetaString(yoastMeta.description)),
        url: canonicalUrl,
        siteName: getMetaString(yoastMeta.og_site_name),
        images: getOgImage(yoastMeta.og_image),
        type: 'video.tv_show',
      },
      twitter: {
        card: 'summary_large_image',
        title: getMetaString(yoastMeta.twitter_title, getMetaString(yoastMeta.og_title, anime.title)),
        description: getMetaString(yoastMeta.twitter_description, getMetaString(yoastMeta.og_description)),
        images: [getOgImage(yoastMeta.twitter_image)[0]?.url || ''],
      },
    };
  }

  const plainDescription = anime.description
    ? anime.description.replace(/<[^>]*>?/gm, '')
    : 'No description available.';
  const truncatedDescription = plainDescription.substring(0, 155);
  return {
    title: `${anime.title} - GogoSugoi`,
    description: `Watch episodes of ${anime.title} online. Synopsis: ${truncatedDescription}...`,
    openGraph: {
      title: `${anime.title} - GogoSugoi`,
      description: `Watch episodes of ${anime.title} online.`,
      images: [{ url: anime.coverImage || '/placeholder.png' }],
    },
  };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function AnimeDetailsPage({ params }: PageProps): Promise<ReactElement> {
  const { slug } = await Promise.resolve(params);

  const [anime, ads] = await Promise.all([
    getAnimeDetails(decodeURIComponent(slug)),
    getAdPlacements(),
  ]);

  if (!anime) {
    notFound();
  }

  const firstEpisodeSlug = anime.episodes?.[0]?.slug;

  const schema = anime.yoastSeo?.schema;
  const jsonLdSchema: JsonLdSchema[] | null =
    schema && typeof schema === 'object' && '@graph' in schema && Array.isArray(schema['@graph'])
      ? (schema['@graph'] as JsonLdSchema[])
      : null;

  return (
    <main className="min-h-screen bg-[#141519] text-white">
      {jsonLdSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      )}

      <div className="relative h-48 w-full md:h-64">
        {anime.coverImage && (
          <Image
            src={anime.coverImage}
            alt={`Background for ${anime.title}`}
            fill
            className="object-cover object-top"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141519] via-[#141519]/80 to-transparent"></div>
      </div>

      <div className="container mx-auto -mt-24 px-4 pb-12 md:-mt-32">
        <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 w-full">
              <div className="aspect-[2/3] relative">
                {anime.coverImage && (
                  <Image
                    src={anime.coverImage}
                    alt={`Cover for ${anime.title}`}
                    fill
                    className="rounded-md shadow-lg"
                    sizes="(max-width: 1023px) 100vw, 25vw"
                  />
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={firstEpisodeSlug ? `/watch/${slug}/${firstEpisodeSlug}` : '#'}
                  className={`flex w-full items-center justify-center gap-2 rounded px-4 py-3 font-bold transition-colors ${
                    firstEpisodeSlug
                      ? 'bg-orange-500 text-black hover:bg-orange-400'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-disabled={!firstEpisodeSlug}
                >
                  <PlayCircle size={20} />
                  <span>{firstEpisodeSlug ? 'START WATCHING E1' : 'NO EPISODES'}</span>
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded border border-gray-600 bg-gray-700 px-4 py-3 font-semibold transition-colors hover:bg-gray-600"
                >
                  <Bookmark size={20} />
                  <span>ADD TO WATCHLIST</span>
                </button>
              </div>
            </div>
          </aside>

          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
                Advertisement
              </h3>
              <div className="mx-auto flex justify-center w-[160px] h-[600px] bg-gray-900/50 rounded-md">
                <AdSlot script={ads?.script_banner_sidebar ?? null} />
              </div>
            </div>
          </aside>

          <div className="lg:col-span-5">
            <div className="mb-6">
              <h1 className="text-3xl font-bold md:text-4xl">{anime.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400" />
                  <span>4.8 (10.1k Reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tv size={16} />
                  <span>{anime.type || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{anime.releaseYear || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-gray-700 px-3 py-1 text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p
              className="mb-8 text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: anime.description?.replace(/\n/g, '<br />') || 'No synopsis available.',
              }}
            />

            <div className="sticky top-[70px] bg-[#141519] py-4 z-10">
              <div className="flex items-center justify-between border-b-2 border-orange-500 pb-2">
                <h2 className="text-xl font-bold">
                  Season 1 ({anime.episodes?.length || 0} Episodes)
                </h2>
              </div>
            </div>

            <div className="mt-4 flow-root">
              <ul className="-m-4 divide-y divide-gray-800">
                {anime.episodes && anime.episodes.length > 0 ? (
                  anime.episodes.map((episode, index) => (
                    <li key={episode.id}>
                      <Link
                        href={`/watch/${slug}/${episode.slug}`}
                        className="group flex gap-4 p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded">
                          {anime.coverImage && (
                            <Image
                              src={anime.coverImage}
                              alt=""
                              fill
                              className="object-cover transition-transform group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <PlayCircle size={32} className="text-white" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold group-hover:text-orange-400">
                            E{index + 1} - {episode.nameExtend || episode.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                            {anime.description
                              ? anime.description.replace(/<[^>]*>?/gm, '')
                              : 'No description for this episode.'}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-center text-gray-400">
                    No episodes available for this season.
                  </li>
                )}
              </ul>
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
                Advertisement
              </h3>
              <div className="mx-auto flex justify-center w-[160px] h-[600px] bg-gray-900/50 rounded-md">
                <AdSlot script={ads?.script_banner_sidebar ?? null} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
