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

    .gallery-wrap .gallery-item {
        float: left;
        margin-bottom: 10px;
        margin-right: .8%;
        max-height: 250px;
        overflow: hidden;
        position: relative;
        width: 32.8%;
    }

    .gallery-wrap .gallery-item .skeleton-img-wrap {
        width: 100%;
        padding-bottom: 66.67%;
        position: relative;
        overflow: hidden;
        border-radius: 4px;
    }

    .gallery-wrap .gallery-item .skeleton-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .gallery-wrap .gallery-item .skeleton-title {
        height: 20px;
        margin-top: 10px;
        margin-bottom: 5px;
        border-radius: 4px;
    }

    .gallery-wrap .gallery-item .skeleton-author {
        height: 16px;
        width: 60%;
        border-radius: 4px;
    }
</style>

<section class="section pt-50 pb-50">
    <div class="container">
        <div class="page-content">
            <div class="post-group post-group--single">
                <div class="post-group__header">
                    <h3
                        class="post-group__title skeleton-loading-bg"
                        style="width: 150px; height: 32px; border-radius: 4px;"
                    ></h3>
                </div>
                <div class="post-group__content">
                    <div class="gallery-wrap">
                        @for ($i = 0; $i < 6; $i++)
                            <div class="gallery-item">
                                <div class="skeleton-img-wrap">
                                    <div class="skeleton-img skeleton-loading-bg"></div>
                                </div>
                            </div>
                        @endfor
                    </div>
                    <div style="clear: both"></div>
                </div>
            </div>
        </div>
    </div>
</section>
