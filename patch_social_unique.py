import os

# 1. Update src/types.ts
target_path_types = os.path.join("src", "types.ts")
with open(target_path_types, "r", encoding="utf-8") as f:
    content_types = f.read()

# Add new fields to SocialMediaAccount interface
old_interface = """export interface SocialMediaAccount {
  signedUp: boolean;
  followers: number;
  verified: boolean;
  suspended: boolean;
  postsCount: number;
  subscribers?: number; // OnlyFans specific
  subscriptionPrice?: number; // OnlyFans specific
}"""

new_interface = """export interface SocialMediaAccount {
  signedUp: boolean;
  followers: number;
  verified: boolean;
  suspended: boolean;
  postsCount: number;
  subscribers?: number; // OnlyFans specific
  subscriptionPrice?: number; // OnlyFans specific
  monetized?: boolean; // YouTube, Twitch, TikTok specific
  tipsCollected?: boolean; // OnlyFans specific (resets yearly)
  wishlistPosted?: boolean; // OnlyFans specific (resets yearly)
}"""

content_types = content_types.replace(old_interface, new_interface)
with open(target_path_types, "w", encoding="utf-8") as f:
    f.write(content_types)

# 2. Update src/App.tsx
target_path_app = os.path.join("src", "App.tsx")
with open(target_path_app, "r", encoding="utf-8") as f:
    content_app = f.read()

# Add states in App.tsx
state_insert_point = "  const [showVerifyRejection, setShowVerifyRejection] = useState<boolean>(false);"
new_states = """  const [showVerifyRejection, setShowVerifyRejection] = useState<boolean>(false);
  const [showSubscriptionFeeModal, setShowSubscriptionFeeModal] = useState<boolean>(false);
  const [showWishlistModal, setShowWishlistModal] = useState<boolean>(false);
  const [wishlistGifts, setWishlistGifts] = useState<string[]>(['Shoes', 'Designer Bag', 'Lingerie']);
  const [tempSubscriptionPrice, setTempSubscriptionPrice] = useState<number>(10);"""

content_app = content_app.replace(state_insert_point, new_states)

# Initialize socialMedia with additional fields in initialGameState
old_initial_state = """      socialMedia: {
        facebook: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        instagram: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        onlyfans: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, subscribers: 0, subscriptionPrice: 10 },
        tiktok: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        twitch: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        twitter: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        soundcloud: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        podcast: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        youtube: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 }
      },"""

new_initial_state = """      socialMedia: {
        facebook: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        instagram: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        onlyfans: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, subscribers: 0, subscriptionPrice: 10, tipsCollected: false, wishlistPosted: false },
        tiktok: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, monetized: false },
        twitch: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, monetized: false },
        twitter: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        soundcloud: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        podcast: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 },
        youtube: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0, monetized: false }
      },"""

content_app = content_app.replace(old_initial_state, new_initial_state)

# Reset OnlyFans tipsCollected and wishlistPosted on ageUp
age_up_reset_code = """      // Reset annual post counts
      data.postsCount = 0;"""

age_up_reset_new_code = """      // Reset annual post counts
      data.postsCount = 0;
      data.tipsCollected = false;
      data.wishlistPosted = false;"""

content_app = content_app.replace(age_up_reset_code, age_up_reset_new_code)

# Update YouTube, Twitch, TikTok payouts to only work if monetized === true
old_youtube_payout = """        } else if (channel === 'youtube' && data.followers >= 10000) {
          const payout = Math.floor(data.followers * 0.05);
          earnedCash += payout;
          socialLogs.push(`🎥 YouTube: Earned $${payout.toLocaleString()} from ad revenue this year!`);
        } else if (channel === 'twitch' && data.followers >= 5000) {
          const payout = Math.floor(data.followers * 0.08);
          earnedCash += payout;
          socialLogs.push(`🔮 Twitch: Earned $${payout.toLocaleString()} from subscriptions and donations!`);
        } else if (channel === 'tiktok' && data.followers >= 50000) {
          const payout = Math.floor(data.followers * 0.02);
          earnedCash += payout;
          socialLogs.push(`🎵 TikTok: Earned $${payout.toLocaleString()} from the Creator Fund!`);
        }"""

new_youtube_payout = """        } else if (channel === 'youtube' && data.monetized && data.followers >= 10000) {
          const payout = Math.floor(data.followers * 0.05);
          earnedCash += payout;
          socialLogs.push(`🎥 YouTube: Earned $${payout.toLocaleString()} from ad revenue this year!`);
        } else if (channel === 'twitch' && data.monetized && data.followers >= 5000) {
          const payout = Math.floor(data.followers * 0.08);
          earnedCash += payout;
          socialLogs.push(`🔮 Twitch: Earned $${payout.toLocaleString()} from subscriptions and donations!`);
        } else if (channel === 'tiktok' && data.monetized && data.followers >= 50000) {
          const payout = Math.floor(data.followers * 0.02);
          earnedCash += payout;
          socialLogs.push(`🎵 TikTok: Earned $${payout.toLocaleString()} from the Creator Fund!`);
        }"""

content_app = content_app.replace(old_youtube_payout, new_youtube_payout)

# Define unique dashboard actions inside social_channel_dashboard subview
# Let's locate the start of the actions list: "const renderChannelItem = (c: typeof channels[0], active: boolean) => {"
# Or we find the activities div: "{/* List of actions */}" inside the dashboard view.
# We will rewrite the buttons dynamically based on channel ID.
old_dashboard_buttons = """                      {/* List of actions */}
                      <div className="flex-1 overflow-y-auto divide-y divide-[#ebdcb9] bg-white border-b border-[#ebdcb9] text-left pb-24">
                        
                        {/* Celebrity Interaction */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            setSelectedCelebrity('Taylor Swift');
                            setCelebrityInteractionType('reply');
                            setActiveSocialModal('celebrity');
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">⭐</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Celebrity</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">Reply to a celebrity</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Delete Account */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            if (window.confirm(`Are you sure you want to permanently delete your ${titles[channel]} account?`)) {
                              setGameState({
                                ...gameState,
                                socialMedia: {
                                  ...gameState.socialMedia,
                                  [channel]: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 }
                                },
                                log: [...gameState.log, `❌ Closed your ${titles[channel]} account.`]
                              });
                              setAssetsSubView('social_media');
                            }
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">🗑️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-red-600 block">Delete</span>
                            <span className="text-[10px] text-slate-400 block truncate font-mono font-semibold">Delete your account</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Post Content */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            const defaultPostTypes = {
                              facebook: 'Selfie', instagram: 'Selfie', onlyfans: 'Thirst Trap',
                              tiktok: 'Dance Trend', twitch: 'Gaming Stream', twitter: 'Meme',
                              soundcloud: 'Original Track', podcast: 'Solo Rant', youtube: 'Vlog'
                            };
                            setSelectedPostType(defaultPostTypes[channel] || 'Selfie');
                            setActiveSocialModal('post');
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">✍️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Post</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">Make a post</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Promote Product */}
                        <button 
                          onClick={handlePromoteProduct}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">📈</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Promote</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">Promote a product</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Troll */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            // Pick first available relative/friend, otherwise fallback to celebrity
                            const contacts = gameState.relationships.filter(r => !r.isDeceased);
                            if (contacts.length > 0) {
                              setSelectedVictim(contacts[0].name);
                            } else {
                              setSelectedVictim('Taylor Swift');
                            }
                            setActiveSocialModal('troll');
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">👹</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Troll</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">Troll someone</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* Verify Request */}
                        <button 
                          onClick={handleVerifyRequest}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">✔️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Verify</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">Request verification</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                      </div>"""

new_dashboard_buttons = """                      {/* List of actions */}
                      <div className="flex-1 overflow-y-auto divide-y divide-[#ebdcb9] bg-white border-b border-[#ebdcb9] text-left pb-24">
                        
                        {/* 1. OnlyFans: Cross-Promote */}
                        {channel === 'onlyfans' && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              // Check if Twitter or Instagram accounts exist
                              const hasInstagram = gameState.socialMedia?.instagram?.signedUp;
                              const hasTwitter = gameState.socialMedia?.twitter?.signedUp;
                              
                              if (hasInstagram || hasTwitter) {
                                triggerSound('success');
                                const subBoost = Math.max(5, Math.floor(data.followers * 0.05));
                                setGameState({
                                  ...gameState,
                                  socialMedia: {
                                    ...gameState.socialMedia,
                                    onlyfans: { ...data, followers: data.followers + subBoost }
                                  },
                                  log: [...gameState.log, `🍑 Cross-Promoted OnlyFans on other channels! Boosted followers by ${subBoost.toLocaleString()}.`]
                                });
                                setActionPopup({ isOpen: true, title: 'Cross-Promotion Complete', message: `You promoted your OnlyFans on your other social accounts! Followers: +${subBoost.toLocaleString()}` });
                              } else {
                                triggerSound('error');
                                setActionPopup({ isOpen: true, title: 'Action Denied', message: 'You need an active Instagram or Twitter account to cross-promote your OnlyFans!' });
                              }
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">🔄</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Cross-Promote</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Promote your OF on other socials</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 2. YouTube: Buy Subscribers, Others: Buy Followers */}
                        {(channel === 'youtube' || channel === 'instagram' || channel === 'tiktok' || channel === 'twitch') && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              if (gameState.cash < 500) {
                                setActionPopup({ isOpen: true, title: 'Insufficient Funds', message: 'It costs $500 to buy bot followers/subscribers.' });
                                return;
                              }
                              const roll = Math.random();
                              if (roll < 0.25) {
                                triggerSound('error');
                                setGameState({
                                  ...gameState,
                                  cash: gameState.cash - 500,
                                  socialMedia: {
                                    ...gameState.socialMedia,
                                    [channel]: { ...data, signedUp: false, followers: 0, verified: false }
                                  },
                                  log: [...gameState.log, `🚫 BANNED: Caught buying fake bot followers/subscribers on ${titles[channel]}! Account terminated.`]
                                });
                                setActionPopup({ isOpen: true, title: 'Account Terminated', message: 'The moderators caught you buying bots and closed your account!' });
                                setAssetsSubView('social_media');
                              } else {
                                triggerSound('success');
                                const bots = Math.floor(Math.random() * 4000) + 3000;
                                setGameState({
                                  ...gameState,
                                  cash: gameState.cash - 500,
                                  socialMedia: {
                                    ...gameState.socialMedia,
                                    [channel]: { ...data, followers: data.followers + bots }
                                  },
                                  log: [...gameState.log, `🤖 Bought bot subscribers/followers on ${titles[channel]} for $500.`]
                                });
                                setActionPopup({ isOpen: true, title: 'Bots Delivered', message: `Your package has been delivered! (+${bots.toLocaleString()} ${channel === 'youtube' ? 'subscribers' : 'followers'})` });
                              }
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">🛒</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">{channel === 'youtube' ? 'Buy Subscribers' : 'Buy Followers'}</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">{channel === 'youtube' ? 'Buy some subscribers' : 'Buy some followers'}</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 3. Celebrity Interaction (All except OnlyFans, SoundCloud, Podcast, YouTube) */}
                        {channel !== 'onlyfans' && channel !== 'soundcloud' && channel !== 'podcast' && channel !== 'youtube' && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              setSelectedCelebrity('Taylor Swift');
                              setCelebrityInteractionType('reply');
                              setActiveSocialModal('celebrity');
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">⭐</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Celebrity</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Reply to a celebrity</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 4. Delete (All platforms) */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            if (window.confirm(`Are you sure you want to permanently delete your ${titles[channel]} account?`)) {
                              setGameState({
                                ...gameState,
                                socialMedia: {
                                  ...gameState.socialMedia,
                                  [channel]: { signedUp: false, followers: 0, verified: false, suspended: false, postsCount: 0 }
                                },
                                log: [...gameState.log, `❌ Closed your ${titles[channel]} account.`]
                              });
                              setAssetsSubView('social_media');
                            }
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">🗑️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-red-600 block">Delete</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">Delete your account</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* 5. YouTube/Twitch/TikTok: Monetize option */}
                        {(channel === 'youtube' || channel === 'twitch' || channel === 'tiktok') && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              const milestones = { youtube: 10000, twitch: 5000, tiktok: 50000 };
                              const required = milestones[channel as keyof typeof milestones] || 10000;
                              if (data.monetized) {
                                setActionPopup({ isOpen: true, title: 'Already Monetized', message: `Your ${titles[channel]} is fully monetized and generating payouts on every Age Up!` });
                              } else if (data.followers >= required) {
                                triggerSound('success');
                                setGameState({
                                  ...gameState,
                                  socialMedia: {
                                    ...gameState.socialMedia,
                                    [channel]: { ...data, monetized: true }
                                  },
                                  log: [...gameState.log, `💰 Monetization Approved! Started earning ad payouts on ${titles[channel]}.`]
                                });
                                setActionPopup({ isOpen: true, title: 'Monetized Approved!', message: `Congratulations! You turned on monetization on your channel. Payouts will trigger when you Age Up.` });
                              } else {
                                triggerSound('error');
                                setActionPopup({ isOpen: true, title: 'Application Rejected', message: `You need at least ${required.toLocaleString()} subscribers/followers to apply for monetization.` });
                              }
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">💸</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Monetize</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Monetize your account</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 6. Post (All platforms) */}
                        <button 
                          onClick={() => {
                            triggerSound('click');
                            const defaultPostTypes = {
                              facebook: 'Selfie', instagram: 'Selfie', onlyfans: 'Thirst Trap',
                              tiktok: 'Dance Trend', twitch: 'Gaming Stream', twitter: 'Meme',
                              soundcloud: 'Original Track', podcast: 'Solo Rant', youtube: 'Vlog'
                            };
                            setSelectedPostType(defaultPostTypes[channel] || 'Selfie');
                            setActiveSocialModal('post');
                          }}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">✍️</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Post</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">{channel === 'onlyfans' ? 'Start your stream' : 'Post a video' || 'Make a post'}</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* 7. Promote (All platforms) */}
                        <button 
                          onClick={handlePromoteProduct}
                          className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                        >
                          <span className="text-2xl">📈</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-extrabold text-sm text-[#5d4037] block">Promote</span>
                            <span className="text-[10px] text-slate-400 block truncate font-semibold">Promote a product</span>
                          </div>
                          <span className="text-slate-300 font-bold">•••</span>
                        </button>

                        {/* 8. OnlyFans: Subscription Fee */}
                        {channel === 'onlyfans' && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              setTempSubscriptionPrice(data.subscriptionPrice || 10);
                              setShowSubscriptionFeeModal(true);
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">💸</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Subscription Fee</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Adjust subscription rates</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 9. OnlyFans: Tips */}
                        {channel === 'onlyfans' && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              if (data.tipsCollected) {
                                setActionPopup({ isOpen: true, title: 'Already Collected', message: 'You have already collected tips from your fans this year.' });
                                return;
                              }
                              if (data.followers === 0) {
                                setActionPopup({ isOpen: true, title: 'No Fans', message: 'You need followers to receive tips!' });
                                return;
                              }
                              triggerSound('success');
                              const tips = Math.floor(data.followers * (gameState.stats.looks / 100) * (Math.random() * 2 + 0.5));
                              setGameState({
                                ...gameState,
                                cash: gameState.cash + tips,
                                socialMedia: {
                                  ...gameState.socialMedia,
                                  onlyfans: { ...data, tipsCollected: true }
                                },
                                log: [...gameState.log, `💰 Collected $${tips.toLocaleString()} in tips from your OnlyFans subscribers.`]
                              });
                              setActionPopup({ isOpen: true, title: 'Tips Collected', message: `Your subscribers sent you tips!\\n\\nReceived: +$${tips.toLocaleString()}` });
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">💰</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Tips</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Collect tips from your fans</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 10. OnlyFans: Wishlist */}
                        {channel === 'onlyfans' && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              if (data.wishlistPosted) {
                                setActionPopup({ isOpen: true, title: 'Already Posted', message: 'You have already posted a wishlist this year.' });
                                return;
                              }
                              setShowWishlistModal(true);
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">🎁</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Wishlist</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Manage your wishlist</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 11. Troll (All except OnlyFans, SoundCloud, Podcast, YouTube) */}
                        {channel !== 'onlyfans' && channel !== 'soundcloud' && channel !== 'podcast' && channel !== 'youtube' && (
                          <button 
                            onClick={() => {
                              triggerSound('click');
                              const contacts = gameState.relationships.filter(r => !r.isDeceased);
                              if (contacts.length > 0) {
                                setSelectedVictim(contacts[0].name);
                              } else {
                                setSelectedVictim('Taylor Swift');
                              }
                              setActiveSocialModal('troll');
                            }}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">👹</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Troll</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Troll someone</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                        {/* 12. Verify Request (All platforms except OnlyFans, SoundCloud, Podcast) */}
                        {channel !== 'onlyfans' && channel !== 'soundcloud' && channel !== 'podcast' && (
                          <button 
                            onClick={handleVerifyRequest}
                            className="w-full text-left p-3.5 hover:bg-[#fffaf2] transition flex items-center gap-3 cursor-pointer"
                          >
                            <span className="text-2xl">✔️</span>
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-sm text-[#5d4037] block">Verify</span>
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">Request verification</span>
                            </div>
                            <span className="text-slate-300 font-bold">•••</span>
                          </button>
                        )}

                      </div>"""

content_app = content_app.replace(old_dashboard_buttons, new_dashboard_buttons)

with open(target_path_app, "w", encoding="utf-8") as f:
    f.write(content_app)

print("Patch Social Unique Success")
