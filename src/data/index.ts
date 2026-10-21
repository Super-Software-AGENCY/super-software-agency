/**
 * Single entry point for all dynamic site content.
 *
 * Everything that is data (not logic) lives in `src/data` so it can be edited
 * without touching component code.
 */
export { COMPANY } from './company';
export { services, serviceCategories, getServiceById, searchServices, filterServicesByCategory } from './services';
export { HERO_STATS, HERO_BADGES, HERO_BADGE_DETAIL, HERO_BANNER, HERO_TRUSTED_BY } from './hero';
export { ABOUT_VALUES, ABOUT_EXPERTISE, ABOUT_TIMELINE, ABOUT_MISSION, ABOUT_INTRO } from './about';
export { PROCESS_STEPS } from './process';
export { TESTIMONIALS } from './testimonials';
export { FAQS } from './faqs';
export { PROJECT_TYPES, BUDGET_RANGES, TIMELINES, FEATURE_OPTIONS, FORM_COPY } from './forms';
export { NAV_LINKS, NAV_SERVICE_LINKS, NAV_CTA, NAV_FOOTER_CASE_STUDIES } from './navigation';
export { CASE_STUDIES, CASE_CATEGORIES, CASE_COPY } from './case-studies';
