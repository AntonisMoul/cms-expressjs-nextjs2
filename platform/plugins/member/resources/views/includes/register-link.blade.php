<div class="mt-3 text-center">
    {{ trans('plugins/member::dashboard.dont_have_account') }}
    <a
        href="{{ route('public.member.register') }}"
        class="text-decoration-underline"
    >
        {{ trans('plugins/member::dashboard.register_now') }}
    </a>
</div>
