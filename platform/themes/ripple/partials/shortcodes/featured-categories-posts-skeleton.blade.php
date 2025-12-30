<style>
    @keyframes skeleton-loading {
        0% {
            background-position: -200% 0;
        }

        100% {
            background-position: 200% 0;
        }
    }

    .skeleton-loading-bg {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
    }

    .post__vertical--simple .skeleton-thumbnail {
        width: 100%;
        padding-bottom: 66.67%;
    }

    .post__vertical--simple .skeleton-title {
        height: 20px;
        background: #e0e0e0;
        border-radius: 4px;
        margin-bottom: 10px;
        animation: skeleton-loading 1.5s infinite;
    }

    .post__vertical--simple .skeleton-meta {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }

    .post__vertical--simple .skeleton-meta span {
        width: 35px;
        height: 18px;
        background: #e0e0e0;
        border-radius: 4px;
        animation: skeleton-loading 1.5s infinite;
    }

    .post__vertical--simple .skeleton-content {
        height: 14px;
        background: #e0e0e0;
        border-radius: 4px;
        margin-bottom: 6px;
        animation: skeleton-loading 1.5s infinite;
    }

    .post__vertical--simple .skeleton-content:last-child {
        width: 80%;
    }

    .post__horizontal--single .skeleton-thumbnail {
        width: 100px;
        height: 67px;
        flex-shrink: 0;
        float: inline-start;
    }

    .post-group .post-group__title:after {
        background: none;
    }

    .post__horizontal--single .skeleton-title {
        height: 18px;
        background: #e0e0e0;
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-loading 1.5s infinite;
    }

    .post__horizontal--single .skeleton-meta {
        height: 14px;
        width: 100px;
        background: #e0e0e0;
        border-radius: 4px;
        animation: skeleton-loading 1.5s infinite;
    }
</style>

<section class="section pt-50 pb-50 bg-lightgray">
    <div class="container">
        <div class="row">
            <div class="col-lg-9">
                <div class="page-content">
                    <div class="post-group post-group--single">
                        <div class="post-group__header">
                            <h3
                                class="post-group__title skeleton-loading-bg"
                                style="width: 250px; height: 32px; border-radius: 4px;"
                            ></h3>
                        </div>
                        <div class="post-group__content">
                            <div class="row">
                                @for ($chunk = 0; $chunk < 2; $chunk++)
                                    <div class="col-md-6 col-sm-6 col-12">
                                        <article
                                            class="post post__vertical post__vertical--single post__vertical--simple"
                                        >
                                            <div class="skeleton-thumbnail skeleton-loading-bg"></div>
                                            <div class="post__content-wrap">
                                                <header class="post__header">
                                                    <div class="skeleton-title"></div>
                                                    <div class="skeleton-meta">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                </header>
                                                <div class="post__content">
                                                    <div class="skeleton-content"></div>
                                                    <div class="skeleton-content"></div>
                                                </div>
                                            </div>
                                        </article>
                                        @for ($i = 0; $i < 2; $i++)
                                            <article
                                                class="post post__horizontal post__horizontal--single mb-20 clearfix"
                                            >
                                                <div class="skeleton-thumbnail skeleton-loading-bg"></div>
                                                <div class="post__content-wrap">
                                                    <header class="post__header">
                                                        <div class="skeleton-title"></div>
                                                        <div class="skeleton-meta"></div>
                                                    </header>
                                                </div>
                                            </article>
                                        @endfor
                                    </div>
                                @endfor
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="page-sidebar">
                    @for ($i = 0; $i < 3; $i++)
                        <div
                            class="skeleton-loading-bg"
                            style="height: 120px; margin-bottom: 20px; border-radius: 4px;"
                        ></div>
                    @endfor
                </div>
            </div>
        </div>
    </div>
</section>
