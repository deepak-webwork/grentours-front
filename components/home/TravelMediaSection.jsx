'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function TravelMediaSection({
    reels,
    videos,
    reelsLoading,
    videosLoading,
    loading,
    onPlayReel,
    onPlayRandom,
}) {
    const [mobileTab, setMobileTab] = useState('reels');

    if (!loading && reels.length === 0 && videos.length === 0) {
        return null;
    }

    const showReels = reelsLoading || reels.length > 0;
    const showVideos = videosLoading || videos.length > 0;
    const showBothPanels = showReels && showVideos;

    const openReel = (item, isLandscape) => {
        const title = item.title || item.reel_title || item.video_title || 'Travel Video';
        onPlayReel({
            id: item.id,
            video_url: item.video_url,
            title,
            desc: item.description || item.desc || title,
            isLandscape,
        });
    };

    return (
        <section className="tm-hub mb-55" data-aos="fade-up">
            <div className="container-xl">
                {showBothPanels && (
                    <div className="tm-mobile-tabs d-lg-none">
                        <button
                            type="button"
                            className={`tm-tab ${mobileTab === 'reels' ? 'is-active' : ''}`}
                            onClick={() => setMobileTab('reels')}
                        >
                            <i className="bi bi-phone"></i> Short Reels
                        </button>
                        <button
                            type="button"
                            className={`tm-tab ${mobileTab === 'videos' ? 'is-active' : ''}`}
                            onClick={() => setMobileTab('videos')}
                        >
                            <i className="bi bi-collection-play"></i> Travel Videos
                        </button>
                    </div>
                )}

                <div className="tm-grid">
                    {showReels && (
                        <div className={`tm-panel tm-panel--reels ${showBothPanels && mobileTab !== 'reels' ? 'tm-panel--hidden-mobile' : ''}`}>
                            <div className="tm-panel-head">
                                <div className="tm-panel-head-main">
                                    <div className="tm-panel-icon tm-panel-icon--green">
                                        <i className="bi bi-instagram"></i>
                                    </div>
                                    <div>
                                        <h3>Travel Reels</h3>
                                        <p>Quick vertical shorts from our journeys</p>
                                    </div>
                                </div>
                                {!reelsLoading && reels.length > 0 && (
                                    <button type="button" className="tm-shuffle-btn" onClick={onPlayRandom}>
                                        <i className="bi bi-shuffle"></i>
                                        <span className="d-none d-sm-inline">Play Random</span>
                                    </button>
                                )}
                            </div>

                            <div className="tm-carousel-wrap">
                                <button type="button" className="tm-nav tm-nav--prev tm-nav-reels-prev" aria-label="Previous reels">
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <Swiper
                                    modules={[Navigation, FreeMode]}
                                    className="tm-swiper tm-swiper--reels"
                                    slidesPerView={2.15}
                                    spaceBetween={12}
                                    freeMode
                                    navigation={{ prevEl: '.tm-nav-reels-prev', nextEl: '.tm-nav-reels-next' }}
                                    breakpoints={{
                                        576: { slidesPerView: 2.5, spaceBetween: 14 },
                                        768: { slidesPerView: 3.2, spaceBetween: 16 },
                                        992: { slidesPerView: 2.4, spaceBetween: 16 },
                                        1200: { slidesPerView: 3, spaceBetween: 18 },
                                    }}
                                >
                                    {reelsLoading
                                        ? [1, 2, 3, 4].map((idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="tm-reel-card tm-skeleton" />
                                            </SwiperSlide>
                                        ))
                                        : reels.map((reel, idx) => {
                                            const title = reel.title || reel.reel_title || 'Travel Reel';
                                            const imgUrl = reel.thumbnail || '/assets/img/grentours_placeholder.png';
                                            return (
                                                <SwiperSlide key={reel.id || idx}>
                                                    <article
                                                        className="tm-reel-card"
                                                        onClick={() => openReel(reel, false)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => e.key === 'Enter' && openReel(reel, false)}
                                                    >
                                                        <img src={imgUrl} alt={title} loading="lazy" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                        <div className="tm-reel-overlay" />
                                                        <span className="tm-reel-play"><i className="bi bi-play-fill"></i></span>
                                                        <span className="tm-reel-badge">SHORT</span>
                                                        <div className="tm-reel-meta">
                                                            <h4>{title}</h4>
                                                        </div>
                                                    </article>
                                                </SwiperSlide>
                                            );
                                        })}
                                </Swiper>
                                <button type="button" className="tm-nav tm-nav--next tm-nav-reels-next" aria-label="Next reels">
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {showBothPanels && <div className="tm-divider d-none d-lg-block" />}

                    {showVideos && (
                        <div className={`tm-panel tm-panel--videos ${showBothPanels && mobileTab !== 'videos' ? 'tm-panel--hidden-mobile' : ''}`}>
                            <div className="tm-panel-head">
                                <div className="tm-panel-icon tm-panel-icon--blue">
                                    <i className="bi bi-youtube"></i>
                                </div>
                                <div>
                                    <h3>Explore Travel Videos</h3>
                                    <p>In-depth guides, podcasts &amp; adventures</p>
                                </div>
                            </div>

                            <div className="tm-carousel-wrap">
                                <button type="button" className="tm-nav tm-nav--prev tm-nav-videos-prev" aria-label="Previous videos">
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <Swiper
                                    modules={[Navigation, FreeMode]}
                                    className="tm-swiper tm-swiper--videos"
                                    slidesPerView={1.15}
                                    spaceBetween={14}
                                    freeMode
                                    navigation={{ prevEl: '.tm-nav-videos-prev', nextEl: '.tm-nav-videos-next' }}
                                    breakpoints={{
                                        576: { slidesPerView: 1.6, spaceBetween: 14 },
                                        768: { slidesPerView: 2.1, spaceBetween: 16 },
                                        992: { slidesPerView: 1.8, spaceBetween: 16 },
                                        1200: { slidesPerView: 2.2, spaceBetween: 18 },
                                    }}
                                >
                                    {videosLoading
                                        ? [1, 2, 3].map((idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="tm-video-card tm-skeleton" />
                                            </SwiperSlide>
                                        ))
                                        : videos.map((video, idx) => {
                                            const title = video.title || video.video_title || 'Travel Video';
                                            const desc = video.description || title;
                                            const imgUrl = video.thumbnail || '/assets/img/grentours_placeholder.png';
                                            return (
                                                <SwiperSlide key={video.id || idx}>
                                                    <article
                                                        className="tm-video-card"
                                                        onClick={() => openReel(video, true)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => e.key === 'Enter' && openReel(video, true)}
                                                    >
                                                        <div className="tm-video-thumb">
                                                            <img src={imgUrl} alt={title} loading="lazy" onError={(e) => { e.target.src = '/assets/img/grentours_placeholder.png'; }} />
                                                            <span className="tm-video-play"><i className="bi bi-play-fill"></i></span>
                                                        </div>
                                                        <div className="tm-video-body">
                                                            <h4>{title}</h4>
                                                            <p>{desc}</p>
                                                        </div>
                                                    </article>
                                                </SwiperSlide>
                                            );
                                        })}
                                </Swiper>
                                <button type="button" className="tm-nav tm-nav--next tm-nav-videos-next" aria-label="Next videos">
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
