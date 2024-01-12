import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userWallet, userProfile } from "./recoil";
import { getWallet } from "./api/voucherApi";

const useWallet = () => {
    const [wallet, setWalletState] = useRecoilState(userWallet);
    const profile = useRecoilValue(userProfile);

    const getData = () => {
        setWalletState({
            value: wallet.state === "resolve" ? wallet.value : null,
            state: wallet.state === "resolve" ? "resolve" : "pending",
        });


        getWallet(profile.userId)
            .then((resolve) => {
                setWalletState({
                    value: resolve.balance,
                    state: "resolve",
                });
            })
            .catch((reject) => {
                if (reject === "expired") return;
                console.log(reject);
                setWalletState({
                    value: null,
                    state: "reject",
                });
            });
    };

    useEffect(() => {
        if (profile.userId && !wallet.state) getData();
    }, [profile.userId]);

    return { wallet: wallet.value, walletState: wallet.state, refreshWallet: getData, setWallet: (value) => setWalletState({ value, state: "resolve" }) };
};

export default useWallet;
