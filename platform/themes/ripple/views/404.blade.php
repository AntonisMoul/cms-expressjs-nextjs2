@php
    SeoHelper::setTitle(__('404 - Not found'));
    Theme::fireEventGlobalAssets();
    Theme::breadcrumb()->add(SeoHelper::getTitle());
@endphp

{!! Theme::partial('header') !!}
{!! Theme::partial('breadcrumbs') !!}

<style>
    .error-page-wrapper {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .error-page-content {
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
        padding: 0 15px;
    }

    .error-code-container {
        position: relative;
        margin-bottom: 30px;
    }

    .error-code {
        font-size: 10rem;
        font-weight: 700;
        color: var(--color-1st);
        margin: 0;
        line-height: 1;
        position: relative;
        animation: pulse 2s ease-in-out infinite;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
    }

    .error-subtitle {
        font-size: 1.5rem;
        font-weight: 600;
        color: #22292f;
        margin-bottom: 10px;
    }

    .error-description {
        font-size: 1.1rem;
        color: #6c757d;
        margin-bottom: 35px;
        line-height: 1.6;
    }

    .error-reasons-container {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 25px;
        margin: 35px 0;
        text-align: left;
    }

    .error-reasons-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #495057;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .error-reasons-title svg {
        width: 20px;
        height: 20px;
        stroke: var(--color-1st);
        flex-shrink: 0;
        vertical-align: middle;
        margin-top: -2px;
    }

    .error-reasons-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .error-reasons-list li {
        padding: 8px 0 8px 30px;
        position: relative;
        color: #6c757d;
        line-height: 1.6;
        display: flex;
        align-items: flex-start;
    }

    .error-reasons-list li::before {
        content: "•";
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-1st);
        font-weight: bold;
        font-size: 1.2rem;
        line-height: 0;
    }

    .error-actions {
        margin-top: 40px;
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn-home {
        background-color: var(--color-1st);
        color: white;
        padding: 12px 35px;
        font-size: 1rem;
        font-weight: 500;
        border-radius: 25px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        border: 2px solid var(--color-1st);
    }

    .btn-home svg {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
    }

    .btn-home:hover {
        background-color: transparent;
        color: var(--color-1st);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .btn-secondary {
        background-color: transparent;
        color: #6c757d;
        padding: 12px 35px;
        font-size: 1rem;
        font-weight: 500;
        border-radius: 25px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        border: 2px solid #dee2e6;
    }

    .btn-secondary svg {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
    }

    .btn-secondary:hover {
        border-color: var(--color-1st);
        color: var(--color-1st);
        transform: translateY(-2px);
    }

    .error-icon {
        font-size: 3rem;
        color: #dee2e6;
        margin-bottom: 20px;
    }

    @media (max-width: 768px) {
        .error-code {
            font-size: 6rem;
        }

        .error-subtitle {
            font-size: 1.2rem;
        }

        .error-description {
            font-size: 1rem;
        }

        .error-actions {
            flex-direction: column;
            align-items: center;
        }

        .btn-home,
        .btn-secondary {
            width: 100%;
            max-width: 280px;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .error-code {
            font-size: 5rem;
        }

        .error-reasons-container {
            padding: 20px;
        }
    }

    /* RTL Support */
    [dir="rtl"] .error-reasons-list li {
        padding: 8px 30px 8px 0;
    }

    [dir="rtl"] .error-reasons-list li::before {
        left: auto;
        right: 10px;
    }

    [dir="rtl"] .error-actions {
        direction: rtl;
    }

    [dir="rtl"] .btn-home svg,
    [dir="rtl"] .btn-secondary svg {
        margin-left: 0;
        margin-right: 0;
    }

    [dir="rtl"] .error-reasons-container {
        text-align: right;
    }

    [dir="rtl"] .error-reasons-title {
        display: inline-block;
    }

    [dir="rtl"] .error-reasons-title svg {
        order: 1;
        margin-left: 0;
        margin-right: 0;
    }

    [dir="rtl"] .btn-secondary svg {
        transform: scaleX(-1);
    }

    [dir="rtl"] .btn-secondary:hover svg {
        transform: scaleX(-1);
    }
</style>

<section class="section pt-50 pb-100">
    <div class="container">
        <div class="error-page-wrapper">
            <div class="error-page-content">
                <div class="error-code-container">
                    <h1 class="error-code">404</h1>
                </div>

                <h2 class="error-subtitle">{{ __('Page Not Found') }}</h2>

                <p class="error-description">
                    {{ __('Sorry, the page you are looking for could not be found.') }}
                </p>

                <div class="error-reasons-container">
                    <div class="error-reasons-title">
                        <x-core::icon name="ti ti-info-circle" />
                        {{ __('This may have occurred because of several reasons') }}:
                    </div>
                    <ul class="error-reasons-list">
                        <li>{{ __('The page you requested does not exist.') }}</li>
                        <li>{{ __('The link you clicked is no longer.') }}</li>
                        <li>{{ __('The page may have moved to a new location.') }}</li>
                        <li>{{ __('An error may have occurred.') }}</li>
                        <li>{{ __('You are not authorized to view the requested resource.') }}</li>
                    </ul>
                </div>

                <div class="error-actions">
                    <a href="{{ BaseHelper::getHomepageUrl() }}" class="btn-home">
                        <x-core::icon name="ti ti-home" />
                        {{ __('Return to Homepage') }}
                    </a>
                    @if(url()->previous() && url()->previous() !== url()->current())
                    <a href="{{ url()->previous() }}" class="btn-secondary">
                        <x-core::icon name="ti ti-arrow-left" />
                        {{ __('Go Back') }}
                    </a>
                    @endif
                </div>
            </div>
        </div>
    </div>
</section>

{!! Theme::partial('footer') !!}
