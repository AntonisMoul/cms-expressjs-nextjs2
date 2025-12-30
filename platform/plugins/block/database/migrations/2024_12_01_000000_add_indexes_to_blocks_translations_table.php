<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        if (! Schema::hasTable('blocks_translations')) {
            return;
        }

        Schema::table('blocks_translations', function (Blueprint $table): void {
            $table->index('blocks_id', 'idx_blocks_trans_blocks_id');
            $table->index(['blocks_id', 'lang_code'], 'idx_blocks_trans_block_lang');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('blocks_translations')) {
            return;
        }

        Schema::table('blocks_translations', function (Blueprint $table): void {
            $table->dropIndex('idx_blocks_trans_blocks_id');
            $table->dropIndex('idx_blocks_trans_block_lang');
        });
    }
};
