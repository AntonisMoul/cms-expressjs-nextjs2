<?php

namespace Database\Seeders;

use Botble\Member\Models\Member;
use FriendsOfBotble\Comment\Database\Seeders\CommentSeeder as BaseCommentSeeder;

class CommentSeeder extends BaseCommentSeeder
{
    public function getData(): array
    {
        $data = parent::getData();

        if (! is_plugin_active('member')) {
            return $data;
        }

        $accountIds = Member::query()->pluck('id')->all();

        if (empty($accountIds)) {
            return $data;
        }

        foreach ($data as $key => $item) {
            $data[$key]['author_id'] = array_rand($accountIds);
            $data[$key]['author_type'] = Member::class;
        }

        return $data;
    }
}
