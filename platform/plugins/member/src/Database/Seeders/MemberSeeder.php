<?php

namespace Botble\Member\Database\Seeders;

use Botble\Base\Models\BaseModel;
use Botble\Base\Supports\BaseSeeder;
use Botble\Member\Models\Member;
use Botble\Member\Models\MemberActivityLog;
use Botble\Slug\Facades\SlugHelper;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MemberSeeder extends BaseSeeder
{
    public function run(): void
    {
        Member::query()->truncate();
        MemberActivityLog::query()->truncate();

        $memberData = $this->getMemberData();

        foreach ($memberData as $data) {
            /**
             * @var Member $member
             */
            $member = Member::query()->create($data);

            SlugHelper::createSlug($member);
        }
    }

    protected function getMemberData(): array
    {
        $now = $this->now();

        $members = [
            ['first_name' => 'John', 'last_name' => 'Smith', 'email' => 'member@gmail.com'],
            ['first_name' => 'Jane', 'last_name' => 'Doe', 'email' => 'jane.doe@example.com'],
            ['first_name' => 'Robert', 'last_name' => 'Johnson', 'email' => 'robert.johnson@example.com'],
            ['first_name' => 'Emily', 'last_name' => 'Brown', 'email' => 'emily.brown@example.com'],
            ['first_name' => 'Michael', 'last_name' => 'Williams', 'email' => 'michael.williams@example.com'],
            ['first_name' => 'Sarah', 'last_name' => 'Jones', 'email' => 'sarah.jones@example.com'],
            ['first_name' => 'David', 'last_name' => 'Garcia', 'email' => 'david.garcia@example.com'],
            ['first_name' => 'Lisa', 'last_name' => 'Martinez', 'email' => 'lisa.martinez@example.com'],
            ['first_name' => 'James', 'last_name' => 'Anderson', 'email' => 'james.anderson@example.com'],
            ['first_name' => 'Jennifer', 'last_name' => 'Taylor', 'email' => 'jennifer.taylor@example.com'],
        ];

        $data = [];
        $baseId = BaseModel::getTypeOfId() === 'BIGINT' ? 1 : null;

        foreach ($members as $index => $member) {
            $data[] = [
                'id' => $baseId ? ($baseId + $index) : Str::uuid()->toString(),
                'first_name' => $member['first_name'],
                'last_name' => $member['last_name'],
                'email' => $member['email'],
                'password' => Hash::make('12345678'),
                'confirmed_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        return $data;
    }
}
