import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { shareState } from "../../utils/recoil";
import { useSetRecoilState } from "recoil";
import { getKey } from "../../utils/api/authApi";

const Share = () => {
    const setShareState = useSetRecoilState(shareState);
    const [isReady, setReady] = useState(false);
    const router = useRouter();
    const shareKey = router.query.shareKey;

    const getData = () => {
        setReady(false);

        getKey(shareKey)
            .then((resolve) => {
                setShareState({
                    surveyId: resolve.surveyId,
                    verifiedKey: resolve.verifiedType === "automatic" ? resolve.key : null,
                });

                router.replace({
                    pathname: "/survey/" + resolve.surveyId,
                    query: {
                        shareKey: shareKey,
                    },
                });
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setReady(true);
            });
    };

    useEffect(() => {
        if (router.query.shareKey) getData();
    }, [router.query]);

    if (!isReady) return <></>;
    return (
        <div>
            <div>Failed to get referral data</div>
            <button onClick={getData}>Try again</button>
        </div>
    );
};

export default Share;
