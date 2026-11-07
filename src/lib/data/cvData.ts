import type {
	HomeSection,
	EducationSection,
	ExperienceSection,
	ProjectSection,
	SkillSection,
	AchievementSection
} from '$lib/supabase/types';

export const defaultHomeData: HomeSection = {
	id: 'default-home',
	full_name: 'Moh. Yusril Maqoshidana',
	tagline: 'Mobile & Android Developer | Flutter & Kotlin Enthusiast',
	bio: 'I am Information Technology student with 1 year of experience in Mobile Development. Experienced in building mobile applications using Flutter, Jetpack Compose, and XML. Proficient in implementing clean code with expertise in Kotlin and Dart programming languages. Enthusiastic about Android development and mobile architectures.',
	avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
	resume_url: '/cv',
	contact_email: 'yusrilmaqoshidana.work@gmail.com',
	location: 'Jember, East Java',
	whatsapp_url: 'https://wa.link/jlntd2',
	social_links: {
		github: 'https://github.com/YusrilMaqoshidana',
		linkedin: 'http://www.linkedin.com/in/moh-yusril-maqoshidana-ti222410102064',
		whatsapp: 'https://wa.link/jlntd2'
	},
	updated_at: new Date().toISOString()
};

export const defaultEducationData: EducationSection[] = [
	{
		id: 'edu-1',
		institution: 'University of Jember',
		degree: 'Information Technology, Faculty of Computer Science',
		start_date: 'Aug 2022',
		end_date: 'Present',
		gpa: '3.83 / 4.00',
		coursework:
			'Object Oriented Programming, Mobile Based Programming, Application Programming Interface, Software Analysis and Design, Software Development, Design Pattern.',
		display_order: 1,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

export const defaultExperienceData: ExperienceSection[] = [
	{
		id: 'exp-1',
		role_title: 'Cohort – Mobile Development (Android)',
		organization: 'Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka',
		location: 'Indonesia',
		start_date: '2024-09-01',
		end_date: '2025-12-31',
		period_text: 'Sep 2024 – Des 2025',
		description: 'Built and integrated Android apps with Kotlin, machine learning, and cloud computing. Developed soft skills for personal and professional growth.',
		bullet_points: [
			'Built and integrated Android apps with Kotlin, machine learning, and cloud computing.',
			'Developed soft skills for personal and professional growth.'
		],
		display_order: 1,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'exp-2',
		role_title: 'Mobile Development',
		organization: 'Mobile Development Freelancer',
		location: 'Indonesia',
		start_date: '2024-07-01',
		end_date: null,
		period_text: 'Jul 2024 – Present',
		description: 'Build and develop mobile applications based android using Flutter & Dart. Integrate features like Firebase, APIs, and state management (GetX). Project example: Sijago Apps, Kasir Apps, SegarSaji Apps.',
		bullet_points: [
			'Build and develop mobile applications based android using Flutter & Dart.',
			'Integrate features like Firebase, APIs, and state management (GetX).',
			'Project example: Sijago Apps, Kasir Apps, SegarSaji Apps.'
		],
		display_order: 2,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

export const defaultProjectData: ProjectSection[] = [
	{
		id: 'proj-1',
		title: 'Kelolain',
		subtitle: 'Mobile Apps',
		role: 'Designer, Mobile Development',
		period: 'Jul – Aug 2024',
		description: 'Developed a mobile application to prevent online loan fraud by offering AI-based financial management and analysis features. The app also includes quizzes and articles to improve financial literacy.',
		thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
		tech_stack: ['Flutter', 'GetX', 'Firebase', 'Midtrans'],
		demo_url: '',
		repo_url: 'https://github.com/YusrilMaqoshidana/kelolain-app',
		repo_type: 'public',
		bullet_points: [
			'Developed a mobile application to prevent online loan fraud by offering AI-based financial management and analysis features.',
			'The app also includes quizzes and articles to improve financial literacy.',
			'Tech used: Flutter, GetX, Firebase, Midtrans.'
		],
		is_featured: true,
		display_order: 1,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'proj-2',
		title: 'SegarSaji',
		subtitle: 'Mobile Apps',
		role: 'Mobile Development',
		period: 'Jul 2024 – Present',
		description: 'SegarSaji supports two user roles: admins, who manage products and view sales history, and users, who can purchase items and search for products.',
		thumbnail_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
		tech_stack: ['Flutter', 'GetX', 'Firebase', 'Midtrans'],
		demo_url: '',
		repo_url: '',
		repo_type: 'private',
		bullet_points: [
			'SegarSaji supports two user roles: admins, who manage products and view sales history, and users, who can purchase items and search for products.',
			'Implemented Midtrans payment gateway and Google Maps for buyer location.',
			'Tech used: Flutter, GetX, Firebase, Midtrans.'
		],
		is_featured: true,
		display_order: 2,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'proj-3',
		title: 'Story App',
		subtitle: 'Android Apps',
		role: 'Android Development',
		period: 'Oct 2024',
		description: 'Story App is a storytelling application built with Android Native, adhering to clean code principles and leveraging modern libraries.',
		thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
		tech_stack: ['XML', 'Kotlin', 'Google Maps API'],
		demo_url: '',
		repo_url: 'https://github.com/YusrilMaqoshidana/StoryApp',
		repo_type: 'public',
		bullet_points: [
			'Story App is a storytelling application built with Android Native, adhering to clean code principles and leveraging modern libraries.',
			'Key features include a story list with Paging 3, story submission with user location, and the ability to view multiple user locations and their stories using Google Maps API.',
			'Tech used: XML, Kotlin, Google Maps API.'
		],
		is_featured: true,
		display_order: 3,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'proj-4',
		title: 'Handlips App',
		subtitle: 'Android Apps',
		role: 'Designer, Android Development',
		period: 'Nov – Des 2024',
		description: 'Handlips is a Capstone Project application developed during the Bangkit Academy program, aimed at empowering individuals with hearing and speech disabilities to communicate effectively with others.',
		thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
		tech_stack: ['Kotlin', 'JavaScript', 'Python', 'Node.js', 'Jetpack Compose', 'Gemini API', 'Google Cloud API', 'Firebase', 'TensorFlow'],
		demo_url: '',
		repo_url: 'https://github.com/YusrilMaqoshidana/HandLips',
		repo_type: 'public',
		bullet_points: [
			'Handlips is a Capstone Project application developed during the Bangkit Academy program, aimed at empowering individuals with hearing and speech disabilities to communicate effectively with others.',
			'Features real-time sign language translation and speech-to-text functionality for two-way communication.',
			'Additional features include a chatbot for general inquiries, shortcuts for frequently used phrases, and a subscription option.',
			'Tech used: Kotlin, JavaScript, Python, Node.js, Jetpack Compose, Gemini API, Google Cloud API, Firebase, TensorFlow.'
		],
		is_featured: true,
		display_order: 4,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'proj-5',
		title: 'Sijago App',
		subtitle: 'Mobile Apps',
		role: 'Designer, Mobile Development',
		period: 'Des 2024 – Present',
		description: 'Sijago is an application developed in collaboration with the Jember Police Department to streamline the management of reports and information exchange between Babinsa officers and the police.',
		thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
		tech_stack: ['Flutter', 'GetX', 'Firebase'],
		demo_url: '',
		repo_url: '',
		repo_type: 'private',
		bullet_points: [
			'Sijago is an application developed in collaboration with the Jember Police Department to streamline the management of reports and information exchange between Babinsa officers and the police.',
			'Key features include reading and creating reports, accessing articles, a Babinsa leaderboard, and downloading Babinsa data into Excel to simplify reporting to the police resort.',
			'Tech used: Flutter, GetX, Firebase.'
		],
		is_featured: false,
		display_order: 5,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

export const defaultSkillData: SkillSection[] = [
	// Programming Languages
	{ id: 'sk-1', name: 'Dart', category: 'Programming Languages', icon_url: '', display_order: 1, created_at: '', updated_at: '' },
	{ id: 'sk-2', name: 'Kotlin', category: 'Programming Languages', icon_url: '', display_order: 2, created_at: '', updated_at: '' },
	// Frameworks
	{ id: 'sk-3', name: 'Flutter', category: 'Frameworks', icon_url: '', display_order: 3, created_at: '', updated_at: '' },
	{ id: 'sk-4', name: 'Jetpack Compose', category: 'Frameworks', icon_url: '', display_order: 4, created_at: '', updated_at: '' },
	// Database
	{ id: 'sk-5', name: 'Firebase', category: 'Database', icon_url: '', display_order: 5, created_at: '', updated_at: '' },
	{ id: 'sk-6', name: 'Local Database (SQLite/Room)', category: 'Database', icon_url: '', display_order: 6, created_at: '', updated_at: '' },
	{ id: 'sk-7', name: 'SharedPreferences', category: 'Database', icon_url: '', display_order: 7, created_at: '', updated_at: '' },
	{ id: 'sk-8', name: 'PostgreSQL', category: 'Database', icon_url: '', display_order: 8, created_at: '', updated_at: '' },
	{ id: 'sk-9', name: 'MySQL', category: 'Database', icon_url: '', display_order: 9, created_at: '', updated_at: '' },
	// Tools
	{ id: 'sk-10', name: 'Android Studio', category: 'Tools', icon_url: '', display_order: 10, created_at: '', updated_at: '' },
	{ id: 'sk-11', name: 'Visual Studio Code', category: 'Tools', icon_url: '', display_order: 11, created_at: '', updated_at: '' },
	{ id: 'sk-12', name: 'Figma', category: 'Tools', icon_url: '', display_order: 12, created_at: '', updated_at: '' },
	{ id: 'sk-13', name: 'GitHub & Git', category: 'Tools', icon_url: '', display_order: 13, created_at: '', updated_at: '' },
	{ id: 'sk-14', name: 'Trello', category: 'Tools', icon_url: '', display_order: 14, created_at: '', updated_at: '' },
	// Soft Skills
	{ id: 'sk-15', name: 'Problem-solving', category: 'Soft Skills', icon_url: '', display_order: 15, created_at: '', updated_at: '' },
	{ id: 'sk-16', name: 'Communication', category: 'Soft Skills', icon_url: '', display_order: 16, created_at: '', updated_at: '' },
	{ id: 'sk-17', name: 'Collaboration', category: 'Soft Skills', icon_url: '', display_order: 17, created_at: '', updated_at: '' },
	{ id: 'sk-18', name: 'Adaptation', category: 'Soft Skills', icon_url: '', display_order: 18, created_at: '', updated_at: '' },
	{ id: 'sk-19', name: 'Critical Thinking', category: 'Soft Skills', icon_url: '', display_order: 19, created_at: '', updated_at: '' },
	// Languages
	{ id: 'sk-20', name: 'Bahasa Indonesia (Native)', category: 'Languages', icon_url: '', display_order: 20, created_at: '', updated_at: '' },
	{ id: 'sk-21', name: 'English (Elementary Proficiency)', category: 'Languages', icon_url: '', display_order: 21, created_at: '', updated_at: '' }
];

export const defaultAchievementData: AchievementSection[] = [
	{
		id: 'ach-1',
		title: 'Winner Competition Software Development in CODE 2024, Yogyakarta',
		period: 'Aug 2024',
		description: '3rd place from 16 teams',
		certificate_url: 'https://drive.google.com/file/d/1IKi_yCSwTQAbNHTWim16YONZilWdkCcN/view?usp=sharing',
		display_order: 1,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'ach-2',
		title: 'Distinction Graduate - Mobile Development (Android), Indonesia',
		period: 'Jan 2025',
		description: 'Top 10% of 4,636 students from 400 universities',
		certificate_url: 'https://drive.google.com/file/d/1Oi0mYaVI-R5Dmbxe4jvxQD81mmjLT9mG/view?usp=sharing',
		display_order: 2,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];
