export interface Profile {
  name: string;
  bio: string;
  avatar: string;
  website: string;
}

export interface LinkItem {
  title: string;
  subtitle: string;
  url: string;
  /** SVGL search term, e.g. "Discord". Empty string skips the live API lookup. */
  icon: string;
  /** Direct fallback image (SVGL route URL or local asset). */
  iconUrl: string;
  /** Brand color used for the tile tint + hover glow. */
  accent: string;
}

export interface LinksDoc {
  profile: Profile;
  links: LinkItem[];
}
