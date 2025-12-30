<?php

namespace Botble\Block\Database\Seeders;

use Botble\Base\Supports\BaseSeeder;
use Botble\Block\Models\Block;
use Illuminate\Support\Str;

class StaticBlockSeeder extends BaseSeeder
{
    public function run(): void
    {
        Block::query()->truncate();

        $blocks = [
            [
                'name' => 'Welcome Message',
                'description' => 'A welcoming introduction for visitors',
                'content' => 'Welcome to our website! We are dedicated to providing you with the best experience possible. Our team works tirelessly to bring you quality content, innovative solutions, and exceptional service. Whether you are a first-time visitor or a returning customer, we are thrilled to have you here.',
            ],
            [
                'name' => 'About Us Summary',
                'description' => 'Brief company overview and mission statement',
                'content' => 'Founded with a passion for excellence, our company has grown to become a trusted name in the industry. We believe in delivering value through innovation, integrity, and dedication. Our mission is to empower our customers with solutions that make a difference in their lives.',
            ],
            [
                'name' => 'Newsletter Signup',
                'description' => 'Call to action for newsletter subscription',
                'content' => 'Stay updated with our latest news, offers, and insights! Subscribe to our newsletter and be the first to know about exciting developments. Join our community of subscribers who receive exclusive content directly in their inbox.',
            ],
            [
                'name' => 'Contact Information',
                'description' => 'Company contact details and support info',
                'content' => 'Have questions or need assistance? Our support team is here to help. Reach out to us via email at support@example.com or call us at +1 (555) 123-4567. Our office hours are Monday through Friday, 9 AM to 6 PM EST.',
            ],
            [
                'name' => 'Featured Promotion',
                'description' => 'Current promotional content and special offers',
                'content' => 'Do not miss out on our exclusive offers! For a limited time, enjoy special discounts on selected products and services. Take advantage of these amazing deals and discover why our customers keep coming back for more.',
            ],
        ];

        foreach ($blocks as $block) {
            Block::query()->create([
                'name' => $block['name'],
                'alias' => Str::slug($block['name']),
                'description' => $block['description'],
                'content' => $block['content'],
            ]);
        }
    }
}
