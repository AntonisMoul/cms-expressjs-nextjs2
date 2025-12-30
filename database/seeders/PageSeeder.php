<?php

namespace Database\Seeders;

use Botble\Base\Facades\Html;
use Botble\Base\Supports\BaseSeeder;
use Botble\Blog\Models\Category;
use Botble\CookieConsent\Database\Traits\HasCookieConsentSeeder;
use Botble\Page\Database\Traits\HasPageSeeder;

class PageSeeder extends BaseSeeder
{
    use HasPageSeeder;
    use HasCookieConsentSeeder;

    public function run(): void
    {
        $this->truncatePages();

        $pages = [
            [
                'name' => 'Homepage',
                'content' =>
                    Html::tag('div', '[featured-posts enable_lazy_loading="yes"][/featured-posts]') .
                    Html::tag('div', '[recent-posts title="What’s new?" enable_lazy_loading="yes"][/recent-posts]') .
                    Html::tag('div', '[featured-categories-posts title="Best for you" category_id="' . Category::query()->skip(1)->value('id') . '" enable_lazy_loading="yes"][/featured-categories-posts]') .
                    Html::tag('div', '[all-galleries limit="6" title="Galleries" enable_lazy_loading="yes"][/all-galleries]')
                ,
                'template' => 'no-sidebar',
            ],
            [
                'name' => 'Blog',
                'content' => '---',
            ],
            [
                'name' => 'Contact',
                'content' => Html::tag('h2', 'Get in Touch') .
                    Html::tag(
                        'p',
                        'We\'d love to hear from you. Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.'
                    ) .
                    Html::tag('h3', 'Our Office') .
                    Html::tag(
                        'p',
                        'TechHub Innovation Center<br>123 Innovation Drive, Suite 400<br>San Francisco, CA 94105, USA'
                    ) .
                    Html::tag('h3', 'Contact Information') .
                    Html::tag('p', 'Phone: +1 (415) 555-0123') .
                    Html::tag('p', 'Email: hello@techhub.com') .
                    Html::tag('p', 'Support: support@techhub.com') .
                    Html::tag('h3', 'Business Hours') .
                    Html::tag('p', 'Monday - Friday: 9:00 AM - 6:00 PM PST<br>Saturday - Sunday: Closed') .
                    Html::tag(
                        'p',
                        '[google-map]123 Innovation Drive, San Francisco, CA 94105, USA[/google-map]'
                    ) .
                    Html::tag('h3', 'Send Us a Message') .
                    Html::tag('p', 'Fill out the form below and we\'ll get back to you within 24 hours.') .
                    Html::tag('p', '[contact-form][/contact-form]'),
            ],
            [
                'name' => $this->getCookieConsentPageName(),
                'content' => $this->getCookieConsentPageContent(),
            ],
            [
                'name' => 'Galleries',
                'content' => '<div>[gallery title="Galleries" enable_lazy_loading="yes"][/gallery]</div>',
            ],
            [
                'name' => 'About Us',
                'content' => Html::tag('h2', 'About TechHub') .
                    Html::tag(
                        'p',
                        'Founded in 2020, TechHub has quickly become a leading voice in technology journalism and innovation. Our mission is to demystify technology and make it accessible to everyone.'
                    ) .
                    Html::tag('h3', 'Our Mission') .
                    Html::tag(
                        'p',
                        'To provide insightful, accurate, and timely technology news and analysis that helps our readers understand and navigate the rapidly evolving digital landscape.'
                    ) .
                    Html::tag('h3', 'What We Cover') .
                    Html::tag(
                        'ul',
                        Html::tag('li', 'Breaking tech news and announcements') .
                        Html::tag('li', 'In-depth product reviews and comparisons') .
                        Html::tag('li', 'Industry analysis and market trends') .
                        Html::tag('li', 'Startup spotlights and founder interviews') .
                        Html::tag('li', 'Technology tutorials and how-to guides')
                    ) .
                    Html::tag('h3', 'Our Team') .
                    Html::tag(
                        'p',
                        'Our team consists of experienced technology journalists, industry analysts, and passionate tech enthusiasts who bring diverse perspectives and expertise to our coverage.'
                    ) .
                    Html::tag('h3', 'Join Our Community') .
                    Html::tag(
                        'p',
                        'With over 1 million monthly readers, TechHub has built a vibrant community of technology professionals, enthusiasts, and curious minds. Join us in exploring the future of technology.'
                    ),
            ],
            [
                'name' => 'Privacy Policy',
                'content' => Html::tag('h2', 'Privacy Policy') .
                    Html::tag('p', Html::tag('em', 'Last updated: ' . date('F d, Y'))) .
                    Html::tag('h3', '1. Information We Collect') .
                    Html::tag(
                        'p',
                        'We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.'
                    ) .
                    Html::tag('h3', '2. How We Use Your Information') .
                    Html::tag(
                        'p',
                        'We use the information we collect to provide, maintain, and improve our services, send you technical notices and support messages, and respond to your comments and questions.'
                    ) .
                    Html::tag('h3', '3. Information Sharing') .
                    Html::tag(
                        'p',
                        'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.'
                    ) .
                    Html::tag('h3', '4. Data Security') .
                    Html::tag(
                        'p',
                        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
                    ) .
                    Html::tag('h3', '5. Your Rights') .
                    Html::tag(
                        'p',
                        'You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.'
                    ) .
                    Html::tag('h3', '6. Contact Us') .
                    Html::tag(
                        'p',
                        'If you have any questions about this Privacy Policy, please contact us at privacy@techhub.com.'
                    ),
            ],
            [
                'name' => 'Terms of Service',
                'content' => Html::tag('h2', 'Terms of Service') .
                    Html::tag('p', Html::tag('em', 'Effective date: ' . date('F d, Y'))) .
                    Html::tag('h3', '1. Acceptance of Terms') .
                    Html::tag(
                        'p',
                        'By accessing and using TechHub, you agree to be bound by these Terms of Service and all applicable laws and regulations.'
                    ) .
                    Html::tag('h3', '2. Use License') .
                    Html::tag(
                        'p',
                        'Permission is granted to temporarily download one copy of the materials on TechHub for personal, non-commercial transitory viewing only.'
                    ) .
                    Html::tag('h3', '3. Disclaimer') .
                    Html::tag(
                        'p',
                        'The materials on TechHub are provided on an \'as is\' basis. TechHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.'
                    ) .
                    Html::tag('h3', '4. Limitations') .
                    Html::tag(
                        'p',
                        'In no event shall TechHub or its suppliers be liable for any damages arising out of the use or inability to use the materials on TechHub.'
                    ) .
                    Html::tag('h3', '5. Revisions') .
                    Html::tag(
                        'p',
                        'TechHub may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the current version of these terms of service.'
                    ),
            ],
        ];

        $this->createPages($pages);
    }
}
