export interface SocialLinks {
	github?: string;
	linkedin?: string;
	instagram?: string;
	twitter?: string;
	website?: string;
	[key: string]: string | undefined;
}

export interface HomeSection {
	id: string;
	full_name: string;
	tagline: string;
	bio: string;
	avatar_url: string;
	resume_url: string;
	social_links: SocialLinks;
	updated_at: string;
}

export interface ProjectSection {
	id: string;
	title: string;
	description: string;
	thumbnail_url: string;
	tech_stack: string[];
	demo_url: string;
	repo_url: string;
	is_featured: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface SkillSection {
	id: string;
	name: string;
	category: 'frontend' | 'backend' | 'mobile' | 'tools' | 'database' | string;
	proficiency_level: number;
	icon_url: string;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface ExperienceSection {
	id: string;
	role_title: string;
	organization: string;
	start_date: string;
	end_date: string | null;
	description: string;
	location: string;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface Database {
	public: {
		Tables: {
			home_section: {
				Row: HomeSection;
				Insert: Omit<HomeSection, 'id' | 'updated_at'> & { id?: string; updated_at?: string };
				Update: Partial<HomeSection>;
			};
			project_section: {
				Row: ProjectSection;
				Insert: Omit<ProjectSection, 'id' | 'created_at' | 'updated_at'> & {
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: Partial<ProjectSection>;
			};
			skill_section: {
				Row: SkillSection;
				Insert: Omit<SkillSection, 'id' | 'created_at' | 'updated_at'> & {
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: Partial<SkillSection>;
			};
			experience_section: {
				Row: ExperienceSection;
				Insert: Omit<ExperienceSection, 'id' | 'created_at' | 'updated_at'> & {
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: Partial<ExperienceSection>;
			};
		};
	};
}
