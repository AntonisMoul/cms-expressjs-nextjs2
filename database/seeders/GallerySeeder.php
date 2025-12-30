<?php

namespace Database\Seeders;

use Botble\Base\Supports\BaseSeeder;
use Botble\Gallery\Database\Traits\HasGallerySeeder;

class GallerySeeder extends BaseSeeder
{
    use HasGallerySeeder;

    public function run(): void
    {
        $galleries = [
            'Tech Conference 2024',
            'Product Launch Event',
            'Team Building Retreat',
            'Innovation Summit',
            'Developer Meetup',
            'AI Workshop Series',
            'Startup Showcase',
            'Company Anniversary',
            'Hackathon Weekend',
            'Industry Awards Night',
            'New Office Opening',
            'Community Outreach',
            'Tech Talks Series',
            'Partnership Celebration',
            'Year in Review',
        ];

        $galleryDescriptions = [
            'Tech Conference 2024' => 'Annual technology conference featuring keynote speakers, workshops, and networking opportunities for industry professionals.',
            'Product Launch Event' => 'Exclusive unveiling of our latest product line with live demonstrations and Q&A sessions with the development team.',
            'Team Building Retreat' => 'Company-wide retreat focused on collaboration, innovation, and strengthening team bonds in a relaxed environment.',
            'Innovation Summit' => 'Two-day summit bringing together thought leaders to discuss emerging technologies and future trends.',
            'Developer Meetup' => 'Monthly gathering of developers to share knowledge, discuss best practices, and collaborate on open-source projects.',
            'AI Workshop Series' => 'Hands-on workshops covering machine learning, neural networks, and practical AI applications.',
            'Startup Showcase' => 'Platform for emerging startups to present their innovative solutions to investors and industry experts.',
            'Company Anniversary' => 'Celebrating our journey with employees, partners, and customers who made our success possible.',
            'Hackathon Weekend' => '48-hour coding marathon where teams compete to build innovative solutions to real-world problems.',
            'Industry Awards Night' => 'Annual ceremony recognizing excellence and innovation in technology across various categories.',
            'New Office Opening' => 'Grand opening of our state-of-the-art facility designed to foster creativity and collaboration.',
            'Community Outreach' => 'Initiatives focused on giving back to the community through education and technology access programs.',
            'Tech Talks Series' => 'Weekly presentations by industry experts covering cutting-edge technologies and best practices.',
            'Partnership Celebration' => 'Commemorating strategic partnerships that drive innovation and mutual growth.',
            'Year in Review' => 'Annual retrospective highlighting achievements, milestones, and setting vision for the future.',
        ];

        $imageDescriptions = [
            'Keynote speaker presenting on stage to packed auditorium',
            'Team collaboration during breakout session',
            'Networking event with industry professionals',
            'Product demonstration at exhibition booth',
            'Panel discussion with technology leaders',
            'Hands-on coding workshop in progress',
            'Award ceremony moment with winner on stage',
            'Innovative product showcase and demo area',
            'Team celebrating project completion',
            'Audience engaged in Q&A session',
            'Workshop participants working on laptops',
            'Startup pitch presentation to investors',
            'Company executives cutting ribbon at opening',
            'Community members learning new skills',
            'Technical demonstration of new features',
            'Partners signing collaboration agreement',
            'Team brainstorming in modern workspace',
            'Conference attendees during coffee break',
            'Innovation lab with latest technology',
            'Closing ceremony group photo',
        ];

        $this->createGalleries(
            collect($galleries)->map(function (string $item, int $index) use ($galleryDescriptions) {
                return [
                    'name' => $item,
                    'description' => $galleryDescriptions[$item] ?? '',
                    'is_featured' => $index < 6,
                    'image' => $this->filePath('news/' . ($index + 6) . '.jpg'),
                ];
            })->toArray(),
            array_map(function ($index) use ($imageDescriptions) {
                return [
                    'img' => $this->filePath('news/' . $index . '.jpg'),
                    'description' => $imageDescriptions[$index - 1] ?? 'Event photography capturing memorable moments',
                ];
            }, range(1, 20))
        );
    }
}
