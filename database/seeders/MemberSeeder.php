<?php

namespace Database\Seeders;

use Botble\Base\Models\BaseModel;
use Botble\Member\Database\Seeders\MemberSeeder as BaseMemberSeeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MemberSeeder extends BaseMemberSeeder
{
    protected function getMemberData(): array
    {
        $files = $this->uploadFiles('members');

        $now = $this->now();

        $parentData = parent::getMemberData();

        $data = [];
        foreach ($parentData as $member) {
            $data[] = [
                'id' => $member['id'],
                'first_name' => $member['first_name'],
                'last_name' => $member['last_name'],
                'email' => $member['email'],
                'password' => $member['password'],
                'dob' => null,
                'description' => null,
                'phone' => null,
                'confirmed_at' => $member['confirmed_at'],
                'created_at' => $member['created_at'],
                'updated_at' => $member['updated_at'],
            ];
        }

        $additionalMembers = [
            [
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'email' => 'sarah.johnson@techmail.com',
                'dob' => '1992-03-15',
                'description' => 'Senior Software Engineer with 10+ years of experience in cloud architecture and distributed systems.',
                'phone' => '+1 (555) 234-5678',
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Chen',
                'email' => 'michael.chen@innovate.io',
                'dob' => '1988-07-22',
                'description' => 'Tech entrepreneur and startup advisor. Founded 3 successful SaaS companies.',
                'phone' => '+1 (555) 345-6789',
            ],
            [
                'first_name' => 'Emily',
                'last_name' => 'Rodriguez',
                'email' => 'emily.rodriguez@designhub.com',
                'dob' => '1995-11-08',
                'description' => 'UX/UI Designer specializing in mobile applications and accessibility.',
                'phone' => '+1 (555) 456-7890',
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Kim',
                'email' => 'david.kim@airesearch.org',
                'dob' => '1990-01-30',
                'description' => 'AI Research Scientist focusing on natural language processing and computer vision.',
                'phone' => '+1 (555) 567-8901',
            ],
            [
                'first_name' => 'Jessica',
                'last_name' => 'Thompson',
                'email' => 'jessica.thompson@securitypro.net',
                'dob' => '1991-09-12',
                'description' => 'Cybersecurity expert and ethical hacker. CISSP certified with expertise in penetration testing.',
                'phone' => '+1 (555) 678-9012',
            ],
        ];

        $baseId = BaseModel::getTypeOfId() === 'BIGINT' ? 11 : null;

        foreach ($additionalMembers as $index => $member) {
            $daysAgo = rand(30, 700);
            $createdAt = Carbon::now()->subDays($daysAgo);
            $data[] = [
                'id' => $baseId ? ($baseId + $index) : Str::uuid()->toString(),
                'first_name' => $member['first_name'],
                'last_name' => $member['last_name'],
                'email' => $member['email'],
                'password' => Hash::make('12345678'),
                'dob' => $member['dob'],
                'description' => $member['description'],
                'phone' => $member['phone'],
                'confirmed_at' => $createdAt,
                'created_at' => $createdAt,
                'updated_at' => $now,
            ];
        }

        foreach ($data as $index => &$item) {
            if (! isset($files[$index])) {
                continue;
            }

            $file = $files[$index];

            $item['avatar_id'] = $file['error'] ? 0 : $file['data']->id;
        }

        return $data;
    }
}
