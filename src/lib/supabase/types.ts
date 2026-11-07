export interface SocialLinks {
	github?: string;
	linkedin?: string;
	instagram?: string;
	twitter?: string;
	website?: string;
	whatsapp?: string;
	[key: string]: string | undefined;
}

export interface HomeSection {
	id: string;
	full_name: string;
	tagline: string;
	bio: string;
	avatar_url: string;
	resume_url: string;
	contact_email?: string;
	location?: string;
	whatsapp_url?: string;
	social_links: SocialLinks;
	updated_at: string;
}

export interface ProjectSection {
	id: string;
	title: string;
	subtitle?: string;
	role?: string;
	period?: string;
	description: string;
	thumbnail_url: string;
	tech_stack: string[];
	demo_url: string;
	repo_url: string;
	repo_type?: 'public' | 'private' | string;
	bullet_points?: string[];
	is_featured: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface SkillSection {
	id: string;
	name: string;
	category: 'Programming Languages' | 'Frameworks' | 'Database' | 'Tools' | 'Soft Skills' | 'Languages' | 'frontend' | 'backend' | 'mobile' | 'tools' | 'database' | string;
	proficiency_level?: number;
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
	period_text?: string;
	description: string;
	bullet_points?: string[];
	location: string;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface EducationSection {
	id: string;
	institution: string;
	degree: string;
	start_date: string;
	end_date: string;
	gpa?: string;
	coursework?: string;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface AchievementSection {
	id: string;
	title: string;
	period?: string;
	description?: string;
	certificate_url?: string;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface ContactMessage {
	id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	is_read: boolean;
	created_at: string;
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
			education_section: {
				Row: EducationSection;
				Insert: Omit<EducationSection, 'id' | 'created_at' | 'updated_at'> & {
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: Partial<EducationSection>;
			};
			achievement_section: {
				Row: AchievementSection;
				Insert: Omit<AchievementSection, 'id' | 'created_at' | 'updated_at'> & {
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: Partial<AchievementSection>;
			};
			contact_messages: {
				Row: ContactMessage;
				Insert: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'> & {
					id?: string;
					created_at?: string;
					updated_at?: string;
					is_read?: boolean;
				};
				Update: Partial<ContactMessage>;
			};
		};
	};
}
