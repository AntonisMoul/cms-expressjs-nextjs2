<?php

namespace Database\Seeders;

use Botble\Base\Facades\Html;
use Botble\Base\Supports\BaseSeeder;
use Botble\Blog\Database\Traits\HasBlogSeeder;

class BlogSeeder extends BaseSeeder
{
    use HasBlogSeeder;

    public function run(): void
    {
        $this->uploadFiles('news');

        $categories = [
            ['name' => 'Artificial Intelligence'],
            ['name' => 'Cybersecurity'],
            ['name' => 'Blockchain Technology'],
            ['name' => '5G and Connectivity'],
            ['name' => 'Augmented Reality (AR)'],
            ['name' => 'Green Technology'],
            ['name' => 'Quantum Computing'],
            ['name' => 'Edge Computing'],
        ];

        $this->createBlogCategories($categories);

        $tags = [
            ['name' => 'AI'],
            ['name' => 'Machine Learning'],
            ['name' => 'Neural Networks'],
            ['name' => 'Cybersecurity'],
            ['name' => 'Blockchain'],
            ['name' => 'Cryptocurrency'],
            ['name' => 'IoT'],
            ['name' => 'AR/VR'],
            ['name' => 'Quantum Computing'],
            ['name' => 'Autonomous Vehicles'],
            ['name' => 'Space Tech'],
            ['name' => 'Robotics'],
            ['name' => 'Cloud Computing'],
            ['name' => 'Big Data'],
            ['name' => 'DevOps'],
            ['name' => 'Mobile Tech'],
            ['name' => '5G'],
            ['name' => 'Biotechnology'],
            ['name' => 'Clean Energy'],
            ['name' => 'Smart Cities'],
        ];

        $this->createBlogTags($tags);

        $posts = [
            [
                'name' => 'The Rise of Quantum Computing: IBM Unveils 1000-Qubit Processor',
                'description' => 'IBM announces a major breakthrough with their new 1000-qubit quantum processor, promising to solve complex problems in drug discovery, financial modeling, and climate research that would take classical computers millennia to compute.',
            ],
            [
                'name' => 'Apple Vision Pro 2: The Future of Spatial Computing Has Arrived',
                'description' => 'Apple\'s second-generation Vision Pro headset launches with improved battery life, lighter design, and revolutionary eye-tracking capabilities that make virtual meetings feel more natural than ever before.',
            ],
            [
                'name' => 'ChatGPT-5 Released: New AI Model Shows Human-Level Reasoning',
                'description' => 'OpenAI\'s latest language model demonstrates unprecedented reasoning abilities, solving complex mathematical proofs and writing code with minimal errors, raising both excitement and ethical concerns in the tech community.',
            ],
            [
                'name' => 'Tesla\'s Full Self-Driving Finally Approved for Highway Use in California',
                'description' => 'After years of development and testing, Tesla receives regulatory approval for fully autonomous highway driving in California, marking a pivotal moment for the autonomous vehicle industry.',
            ],
            [
                'name' => 'Major Cybersecurity Breach: 500 Million Records Exposed in Cloud Storage Misconfiguration',
                'description' => 'A misconfigured AWS S3 bucket leads to one of the largest data breaches in history, exposing personal information of users from multiple Fortune 500 companies and highlighting the importance of cloud security best practices.',
            ],
            [
                'name' => 'Microsoft Introduces AI-Powered Code Review: 40% Reduction in Production Bugs',
                'description' => 'Microsoft\'s new AI code review system, integrated into GitHub, catches potential bugs and security vulnerabilities before deployment, dramatically improving code quality across thousands of repositories.',
            ],
            [
                'name' => 'Boston Dynamics Robots Now Working in Amazon Warehouses',
                'description' => 'Amazon deploys 10,000 Boston Dynamics robots across its fulfillment centers, increasing package processing speed by 300% while reducing workplace injuries by half.',
            ],
            [
                'name' => 'Meta\'s New VR Gloves Let You Feel Virtual Objects',
                'description' => 'Meta unveils haptic gloves that provide realistic touch feedback in virtual reality, allowing users to feel textures, temperatures, and resistance when interacting with digital objects.',
            ],
            [
                'name' => 'Neuralink Begins Human Trials: First Patient Controls Computer with Thoughts',
                'description' => 'Elon Musk\'s brain-computer interface company successfully demonstrates a paralyzed patient playing chess and browsing the internet using only their thoughts, opening new possibilities for assistive technology.',
            ],
            [
                'name' => 'Google\'s Project Starline: 3D Video Calls Without Headsets',
                'description' => 'Google\'s breakthrough in light field display technology enables life-like 3D video conversations without VR headsets, making remote communication feel as natural as sitting across a table.',
            ],
            [
                'name' => 'NVIDIA H200 GPU Breaks AI Training Records',
                'description' => 'NVIDIA\'s latest datacenter GPU trains large language models 5x faster than previous generation, enabling researchers to develop more sophisticated AI models while reducing energy consumption by 40%.',
            ],
            [
                'name' => 'Ethereum 3.0 Launches: 100,000 Transactions Per Second Achieved',
                'description' => 'The long-awaited Ethereum upgrade delivers on its promise of scalability, processing 100,000 transactions per second while maintaining decentralization and reducing gas fees to pennies.',
            ],
            [
                'name' => 'SpaceX Starship Successfully Lands on Moon with NASA Astronauts',
                'description' => 'SpaceX\'s Starship completes its first crewed lunar landing, delivering NASA astronauts to the Moon\'s south pole as part of the Artemis III mission, marking humanity\'s return after 50 years.',
            ],
            [
                'name' => 'Amazon\'s Drone Delivery Expands to 100 Cities Across the US',
                'description' => 'Amazon Prime Air reaches a milestone with autonomous drone deliveries now available in 100 US cities, delivering packages in under 30 minutes with a 99.9% success rate.',
            ],
            [
                'name' => 'Revolutionary Cancer Treatment: AI Discovers Personalized Drug Combinations',
                'description' => 'DeepMind\'s AlphaFold 3 identifies optimal drug combinations for individual cancer patients based on their genetic profile, leading to 80% higher remission rates in clinical trials.',
            ],
            [
                'name' => 'Samsung\'s Transparent OLED Displays Transform Retail Shopping',
                'description' => 'Samsung\'s new transparent OLED technology turns store windows into interactive displays, showing product information and virtual try-ons while maintaining visibility of physical products.',
            ],
            [
                'name' => 'Waymo Robotaxis Now Operating in 25 Major Cities',
                'description' => 'Alphabet\'s Waymo expands its fully autonomous taxi service to 25 cities, completing over 1 million rides per day with zero accidents attributed to the self-driving system.',
            ],
            [
                'name' => 'Solar Paint Achieves 30% Efficiency: Every Building Can Generate Power',
                'description' => 'Breakthrough in perovskite solar cell technology results in paintable solar panels with 30% efficiency, making it economically viable to turn any surface into a power generator.',
            ],
            [
                'name' => 'Blue Origin\'s Space Hotel Welcomes First Tourists',
                'description' => 'Jeff Bezos\' Blue Origin opens the first commercial space hotel in low Earth orbit, offering 10-day stays with spectacular views of Earth for $1 million per person.',
            ],
            [
                'name' => 'AI Teachers in South Korea: Personalized Education for Every Student',
                'description' => 'South Korea implements AI-powered teaching assistants in all public schools, providing personalized learning paths that adapt to each student\'s pace and learning style, improving test scores by 35%.',
            ],
        ];

        $paragraphs = [
            'The rapid advancement of technology continues to reshape our world in unprecedented ways. From artificial intelligence to quantum computing, breakthroughs are occurring at a pace that was unimaginable just a decade ago. These innovations are not only transforming industries but also fundamentally changing how we live, work, and interact with each other. As we stand on the brink of a new technological era, the possibilities seem endless.',
            'Experts predict that the next five years will bring even more dramatic changes to the technology landscape. Machine learning algorithms are becoming increasingly sophisticated, enabling computers to perform tasks that were once thought to be exclusively human domains. This evolution is creating new opportunities while also raising important questions about ethics, privacy, and the future of work.',
            'The intersection of technology and sustainability is becoming increasingly important as we face global environmental challenges. Clean energy solutions, smart grid systems, and eco-friendly manufacturing processes are just a few examples of how innovation can help address climate change. Companies around the world are investing heavily in green technology, recognizing both its environmental benefits and economic potential.',
            'Cybersecurity remains a top priority for organizations of all sizes as digital threats continue to evolve. The sophistication of cyber attacks has increased dramatically, requiring constant vigilance and investment in protective measures. From ransomware to state-sponsored hacking, the threat landscape is more complex than ever before, making robust security practices essential for survival in the digital age.',
            'The democratization of technology is enabling entrepreneurs and small businesses to compete on a global scale. Cloud computing, open-source software, and accessible development tools have lowered barriers to entry across industries. This shift is fostering innovation and creating new economic opportunities in communities around the world, fundamentally changing the competitive dynamics of various markets.',
            'Consumer expectations are driving rapid innovation in user experience and interface design. People now expect seamless, intuitive interactions with technology across all devices and platforms. This has led to significant advancements in natural language processing, gesture recognition, and adaptive interfaces that learn from user behavior to provide personalized experiences.',
            'The healthcare industry is being transformed by digital innovation, from telemedicine to AI-powered diagnostics. These technologies are making healthcare more accessible, efficient, and personalized than ever before. Wearable devices, remote monitoring systems, and electronic health records are creating a more connected and data-driven approach to patient care.',
            'Education technology is revolutionizing how people learn and acquire new skills. Online learning platforms, virtual reality training programs, and AI tutors are making quality education more accessible to people around the world. This transformation is particularly important in rapidly changing job markets where continuous learning has become essential for career success.',
            'The rise of the Internet of Things is connecting billions of devices and creating smart ecosystems in homes, cities, and industries. This interconnectedness is generating vast amounts of data that can be analyzed to improve efficiency, reduce waste, and enhance quality of life. From smart thermostats to connected vehicles, IoT technology is becoming an integral part of daily life.',
            'Privacy concerns are prompting new approaches to data protection and user consent. Regulations like GDPR and CCPA are reshaping how companies collect, store, and use personal information. This shift toward greater transparency and user control is driving innovation in privacy-preserving technologies and changing the relationship between consumers and digital service providers.',
        ];

        $shortParagraphs = [
            'Innovation continues to accelerate across all sectors of the technology industry. New breakthroughs are announced almost daily, pushing the boundaries of what was previously thought possible. This rapid pace of change is creating both opportunities and challenges for businesses and consumers alike.',
            'The global technology community is more connected than ever before. Researchers, developers, and entrepreneurs collaborate across borders to solve complex problems and create new solutions. This international cooperation is essential for addressing the grand challenges facing humanity.',
            'Investment in research and development has reached record levels as companies race to develop the next generation of technologies. From autonomous systems to advanced materials, the scope of innovation is truly remarkable. These investments are laying the groundwork for future breakthroughs.',
            'The human element remains central to technological progress despite increasing automation. Creativity, empathy, and critical thinking are skills that machines cannot easily replicate. The most successful innovations are those that enhance human capabilities rather than simply replacing them.',
            'Standards and interoperability are becoming increasingly important as technology ecosystems grow more complex. The ability for different systems and devices to work together seamlessly is essential for realizing the full potential of digital transformation. Industry cooperation on standards development is accelerating.',
        ];

        foreach ($posts as $index => &$item) {
            $item['content'] =
                ($index % 3 == 0 ? Html::tag(
                    'p',
                    '[youtube-video]https://www.youtube.com/watch?v=SlPhMPnQ58k[/youtube-video]'
                ) : '') .
                Html::tag('p', $paragraphs[$index % count($paragraphs)]) .
                Html::tag(
                    'p',
                    Html::image(
                        $this->fileUrl('news/' . rand(1, 5) . '.jpg', size: 'medium'),
                        'image',
                        ['style' => 'width: 100%', 'class' => 'image_resized']
                    )
                        ->toHtml(),
                    ['class' => 'text-center']
                ) .
                Html::tag('p', $shortParagraphs[$index % count($shortParagraphs)]) .
                Html::tag(
                    'p',
                    Html::image(
                        $this->fileUrl('news/' . rand(6, 10) . '.jpg', size: 'medium'),
                        'image',
                        ['style' => 'width: 100%', 'class' => 'image_resized']
                    )
                        ->toHtml(),
                    ['class' => 'text-center']
                ) .
                Html::tag('p', $paragraphs[($index + 3) % count($paragraphs)]) .
                Html::tag(
                    'p',
                    Html::image(
                        $this->fileUrl('news/' . rand(11, 14) . '.jpg', size: 'medium'),
                        'image',
                        ['style' => 'width: 100%', 'class' => 'image_resized']
                    )
                        ->toHtml(),
                    ['class' => 'text-center']
                ) .
                Html::tag('p', $paragraphs[($index + 5) % count($paragraphs)]);
            $item['is_featured'] = $index < 6;
            $item['image'] = $this->filePath('news/' . ($index + 1) . '.jpg');
        }

        $this->createBlogPosts($posts);
    }
}
