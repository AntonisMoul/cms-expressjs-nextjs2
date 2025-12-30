<div class="mt-3 text-center">
    {{ trans('plugins/member::dashboard.already_have_account') }}
    <a
        href="{{ route('public.member.login') }}"
        class="text-decoration-underline"
    >
        {{ trans('plugins/member::dashboard.login-cta') }}
    </a>
</div>
