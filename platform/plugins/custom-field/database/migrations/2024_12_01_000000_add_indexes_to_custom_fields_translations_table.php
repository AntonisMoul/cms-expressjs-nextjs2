<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        if (! Schema::hasTable('custom_fields_translations')) {
            return;
        }

        Schema::table('custom_fields_translations', function (Blueprint $table): void {
            $table->index('custom_fields_id', 'idx_cf_trans_cf_id');
            $table->index(['custom_fields_id', 'lang_code'], 'idx_cf_trans_cf_lang');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('custom_fields_translations')) {
            return;
        }

        Schema::table('custom_fields_translations', function (Blueprint $table): void {
            $table->dropIndex('idx_cf_trans_cf_id');
            $table->dropIndex('idx_cf_trans_cf_lang');
        });
    }
};
