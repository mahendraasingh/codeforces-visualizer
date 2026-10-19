import React, { useState, useEffect } from "react";
import CartShimmer from "./CartShimmer";

const Body = () => {
    const [inputText, setInputText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [bestRankData, setBestRankData] = useState(null);
    const [lastProblemSolved, setLastProblemSolved] = useState(null);
    const [numberOfProblemWithTag, setNumberOfProblemWithTag] = useState(null);
    const [numberOfProblemSolved, setNumberOfProblemSolved] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSearchClick = () => {
        const trimmed = inputText.trim();
        if (trimmed) {
            setSearchText(trimmed);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    useEffect(() => {
        if (!searchText) return;

        let isMounted = true;

        const fetchUserData = async () => {
            setIsLoading(true);
            setErrorMessage("");
            setUserInfo(null);
            setBestRankData(null);
            setLastProblemSolved(null);
            setNumberOfProblemWithTag(null);
            setNumberOfProblemSolved(null);

            try {
                // 1. Fetch User Info
                const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(searchText)}`);
                const userData = await userRes.json();

                if (userData.status !== "OK" || !userData.result || userData.result.length === 0) {
                    if (isMounted) {
                        setErrorMessage(userData.comment || `User '${searchText}' not found.`);
                        setIsLoading(false);
                    }
                    return;
                }

                if (!isMounted) return;
                setUserInfo(userData.result[0]);

                // 2. Fetch Best Contest Rank
                try {
                    const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(searchText)}`);
                    const ratingData = await ratingRes.json();
                    if (ratingData.status === "OK" && ratingData.result && ratingData.result.length > 0) {
                        let minRankIndex = 0;
                        let minRank = Infinity;
                        for (let i = 0; i < ratingData.result.length; i++) {
                            if (ratingData.result[i].rank < minRank) {
                                minRank = ratingData.result[i].rank;
                                minRankIndex = i;
                            }
                        }
                        if (isMounted) {
                            setBestRankData(ratingData.result[minRankIndex]);
                        }
                    } else if (isMounted) {
                        setBestRankData({ rank: "Unrated / No contests", contestName: "N/A" });
                    }
                } catch {
                    if (isMounted) setBestRankData({ rank: "N/A", contestName: "N/A" });
                }

                // 3. Fetch Status (for last problem solved & all unique solved problems)
                try {
                    const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(searchText)}`);
                    const statusData = await statusRes.json();

                    if (statusData.status === "OK" && statusData.result && statusData.result.length > 0) {
                        // Find last successfully solved problem
                        const okSubmission = statusData.result.find((item) => item.verdict === "OK");
                        if (okSubmission && okSubmission.problem && isMounted) {
                            setLastProblemSolved(okSubmission.problem);
                        } else if (statusData.result[0].problem && isMounted) {
                            setLastProblemSolved(statusData.result[0].problem);
                        }

                        // Filter unique accepted problems
                        const uniqueSet = new Set();
                        const tagMap = new Map();

                        const uniqueSolved = statusData.result.filter((item) => {
                            if (!item.problem || item.verdict !== "OK") return false;
                            const uniqueKey = `${item.problem.contestId || ""}${item.problem.index || ""}`;
                            if (!uniqueSet.has(uniqueKey)) {
                                uniqueSet.add(uniqueKey);
                                return true;
                            }
                            return false;
                        });

                        uniqueSolved.forEach((item) => {
                            if (item.problem && Array.isArray(item.problem.tags)) {
                                item.problem.tags.forEach((tag) => {
                                    tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                                });
                            }
                        });

                        if (isMounted) {
                            setNumberOfProblemSolved(uniqueSolved.length);
                            setNumberOfProblemWithTag(tagMap);
                        }
                    } else if (isMounted) {
                        setNumberOfProblemSolved(0);
                        setNumberOfProblemWithTag(new Map());
                    }
                } catch {
                    if (isMounted) {
                        setNumberOfProblemSolved(0);
                        setNumberOfProblemWithTag(new Map());
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setErrorMessage("Unable to fetch data from Codeforces API. Please try again later.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [searchText]);

    return (
        <div id="body">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter Codeforces Handle (e.g. tourist, Satyam_86770)"
                    className="search-bar"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button type="button" className="search-button" onClick={handleSearchClick}>
                    Search
                </button>
            </div>

            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                </div>
            )}

            {isLoading && <CartShimmer />}

            {!isLoading && userInfo && (
                <div className="user-details">
                    <img
                        src={userInfo.titlePhoto || "https://userpic.codeforces.org/no-title.jpg"}
                        alt={userInfo.handle}
                        className="user-image"
                    />
                    <div className="details">
                        <p><strong>Handle:</strong> {userInfo.handle}</p>
                        {(userInfo.firstName || userInfo.lastName) && (
                            <p><strong>Name:</strong> {`${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim()}</p>
                        )}
                        {(userInfo.city || userInfo.country) && (
                            <p><strong>From:</strong> {[userInfo.city, userInfo.country].filter(Boolean).join(", ")}</p>
                        )}
                        {userInfo.organization && (
                            <p><strong>College/Org:</strong> {userInfo.organization}</p>
                        )}
                        <p>
                            <strong>Current Rating:</strong>{" "}
                            <span className="rating-pill">{userInfo.rating ? `${userInfo.rating} (${userInfo.rank || "unrated"})` : "Unrated"}</span>
                        </p>
                        <p>
                            <strong>Max Rating:</strong>{" "}
                            <span className="rating-pill">{userInfo.maxRating ? `${userInfo.maxRating} (${userInfo.maxRank || "unrated"})` : "Unrated"}</span>
                        </p>
                        <p><strong>Total Friends:</strong> {userInfo.friendOfCount ?? 0}</p>
                        {bestRankData && (
                            <p>
                                <strong>Best Rank:</strong>{" "}
                                {bestRankData.contestName !== "N/A"
                                    ? `#${bestRankData.rank} in ${bestRankData.contestName}`
                                    : bestRankData.rank}
                            </p>
                        )}
                        {lastProblemSolved && (
                            <p>
                                <strong>Last Problem:</strong>{" "}
                                <a
                                    href={`https://codeforces.com/problemset/problem/${lastProblemSolved.contestId}/${lastProblemSolved.index}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="problem-link"
                                >
                                    {lastProblemSolved.index}. {lastProblemSolved.name}
                                </a>
                                {lastProblemSolved.tags && lastProblemSolved.tags.length > 0 && (
                                    <span className="problem-tags"> (Tags: {lastProblemSolved.tags.join(", ")})</span>
                                )}
                            </p>
                        )}
                        {numberOfProblemSolved !== null && (
                            <p><strong>Total Problems Solved:</strong> {numberOfProblemSolved}</p>
                        )}
                        {numberOfProblemWithTag && numberOfProblemWithTag.size > 0 && (
                            <div className="tags-section">
                                <strong>Problems by Topic / Tag:</strong>
                                <div className="tag-badges">
                                    {Array.from(numberOfProblemWithTag.entries()).map(([tag, count]) => (
                                        <span key={tag} className="tag-badge">
                                            <span className="tag-name">{tag}</span>
                                            <span className="tag-count">{count}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Body;