"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { generateMockWallet } from "@/data/orders";
import { WalletType } from "@/types/order";
import {
  CreditCard,
  Wallet,
  Check,
  AlertCircle,
  ShoppingBag,
  Info
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Custom PayPal icon
function PaypalIconCheckout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.8952 6.37572C19.9607 6.02168 19.8952 5.7695 19.6987 5.51732C19.4694 5.23243 19.0436 5.10526 18.5197 5.10526H15.4527C15.2889 5.10526 15.1251 5.23243 15.0596 5.39232L13.5857 12.6358C13.5857 12.7629 13.6512 12.8901 13.782 12.9537C13.8475 13.0172 13.9785 13.0172 14.044 13.0172H15.5834C15.6816 13.0172 15.7471 13.0172 15.8126 12.9537C15.8781 12.9537 15.9108 12.8901 15.9108 12.8266L16.3039 10.6082H18.0385C19.3814 10.6082 20.3274 10.0364 20.6549 8.91197C20.9169 8.21332 20.7531 7.67875 19.8952 6.37572ZM18.6832 8.53522C18.5197 9.10251 18.0385 9.42013 17.3444 9.42013H16.4536L16.8467 7.29904H17.7047C18.3988 7.29904 18.7918 7.61665 18.6832 8.53522Z"
        fill="#003087"
      />
      <path
        d="M9.87347 5.10526H6.80649C6.64273 5.10526 6.47898 5.23243 6.41345 5.39232L4.93955 12.6358C4.93955 12.7629 5.00508 12.8901 5.13587 12.9537C5.2014 13.0172 5.33219 13.0172 5.39772 13.0172H6.93715C7.16643 13.0172 7.32766 12.8901 7.36642 12.6358L7.72396 10.6082H9.45858C10.8014 10.6082 11.7474 10.0364 12.075 8.91197C12.3697 8.21332 12.2059 7.67875 11.3479 6.37572C11.4135 6.02168 11.3479 5.7695 11.1514 5.51732C10.9221 5.23243 10.4964 5.10526 9.87347 5.10526ZM10.136 8.53522C9.97223 9.10251 9.491 9.42013 8.79694 9.42013H7.90614L8.29917 7.29904H9.15717C9.85123 7.29904 10.2443 7.61665 10.136 8.53522Z"
        fill="#0070E0"
      />
      <path
        d="M18.6178 10.6082H16.8832L16.49 12.8266C16.49 12.8901 16.4573 12.9537 16.3918 12.9537C16.3263 13.0172 16.2608 13.0172 16.1626 13.0172H14.6231C14.5576 13.0172 14.4266 13.0172 14.3611 12.9537C14.2956 12.8901 14.2301 12.7629 14.2301 12.6358L15.7039 5.39232C15.7695 5.23243 15.9332 5.10526 16.097 5.10526H19.164C19.6879 5.10526 20.1137 5.23243 20.343 5.51732C20.5394 5.7695 20.605 6.02168 20.5394 6.37572C20.605 6.37572 20.605 6.43932 20.5722 6.5029C20.5722 6.5665 20.5394 6.6301 20.5394 6.6937C20.4738 6.75729 20.4411 6.82089 20.4083 6.88449C20.4083 6.94809 20.3755 7.01169 20.3428 7.07529C20.31 7.13889 20.2772 7.23519 20.2117 7.33149C20.1462 7.42779 20.0806 7.52409 20.0151 7.62039C19.9496 7.71669 19.8513 7.81299 19.753 7.90929C19.6547 8.00559 19.5564 8.10188 19.4254 8.19818C19.2944 8.29448 19.1307 8.35808 18.967 8.42168C18.8032 8.48528 18.6067 8.51257 18.4102 8.54888C18.2136 8.58518 17.9844 8.58518 17.7551 8.58518H17.6896C17.5258 8.58518 17.3621 8.61248 17.1983 8.66707C17.0346 8.72167 16.9036 8.77627 16.7726 8.86356C16.6416 8.95086 16.5433 9.03816 16.4451 9.15916C16.3468 9.28016 16.2813 9.40116 16.2158 9.55206C16.2158 9.55206 16.2158 9.55206 16.2158 9.58837C16.183 9.58837 16.183 9.62467 16.183 9.62467C16.1503 9.66097 16.1503 9.69727 16.1175 9.73357C16.1175 9.76987 16.0848 9.84248 16.0848 9.87878C16.052 9.95138 16.052 10.0239 16.052 10.0966C16.052 10.1692 16.052 10.2418 16.0848 10.3144C16.0848 10.387 16.1175 10.4596 16.1503 10.5323C16.183 10.6049 16.2485 10.6775 16.3141 10.7501C16.3796 10.8227 16.4779 10.8317 16.5761 10.8317H16.7071C16.8054 10.8317 16.9364 10.8317 17.0346 10.8317H17.9254C18.0893 10.8317 18.2203 10.7501 18.2531 10.5992L18.7114 9.01985C18.7114 9.01985 19.9888 8.51257 19.9888 8.51257C20.1526 8.45797 20.3163 8.33697 20.4083 8.21597C20.5002 8.09497 20.5658 7.94407 20.5985 7.79317C20.6313 7.64227 20.6313 7.49137 20.5985 7.34047C20.5658 7.18957 20.5002 7.03867 20.4083 6.92667C20.3163 6.81467 20.1853 6.69367 20.0216 6.60637C19.8579 6.51907 19.6941 6.46447 19.4976 6.43717C19.301 6.40987 19.0718 6.40987 18.8425 6.40987H18.7769C18.6131 6.40987 18.4494 6.43717 18.2857 6.49177C18.1219 6.54637 17.9909 6.60097 17.8599 6.68827C17.7289 6.77557 17.6306 6.86286 17.5324 6.98387C17.4341 7.10487 17.3686 7.22587 17.3031 7.37677C17.3031 7.37677 17.3031 7.37677 17.3031 7.41307C17.2703 7.41307 17.2703 7.44937 17.2703 7.44937C17.2376 7.48567 17.2376 7.52197 17.2048 7.55827C17.2048 7.59457 17.172 7.66718 17.172 7.70348C17.1393 7.77608 17.1393 7.84868 17.1393 7.92128C17.1393 7.99388 17.1393 8.06648 17.172 8.13908C17.172 8.21168 17.2048 8.28428 17.2376 8.35688C17.2703 8.42948 17.3358 8.50208 17.4014 8.57468C17.4669 8.64728 17.5651 8.65628 17.6634 8.65628H17.7944C17.8927 8.65628 18.0237 8.65628 18.1219 8.65628H19.0127C19.1765 8.65628 19.3075 8.57468 19.3403 8.42378L19.7988 6.84438C19.7988 6.84438 19.8316 6.75708 19.8644 6.63608C19.8971 6.51508 19.9299 6.40307 19.9299 6.25217C19.9627 6.10127 19.9627 5.95037 19.9299 5.79947C19.8971 5.64857 19.8316 5.49767 19.7333 5.38567C19.6023 5.27367 19.4386 5.15267 19.2748 5.06537C19.111 4.97807 18.9145 4.92347 18.718 4.89617C18.5214 4.86887 18.2922 4.86887 18.0629 4.86887H17.9974C17.8336 4.86887 17.6698 4.89617 17.5061 4.95077C17.3423 5.00537 17.2113 5.05997 17.0803 5.14727C16.9493 5.23457 16.851 5.32187 16.7528 5.44287C16.6545 5.56387 16.589 5.68487 16.5235 5.83577C16.5235 5.83577 16.5235 5.83577 16.5235 5.87207C16.4907 5.87207 16.4907 5.90837 16.4907 5.90837C16.458 5.94467 16.458 5.98097 16.4252 6.01727C16.4252 6.05357 16.3924 6.12618 16.3924 6.16248C16.3597 6.23508 16.3597 6.30768 16.3597 6.38028C16.3597 6.45288 16.3597 6.52548 16.3924 6.59808C16.3924 6.67068 16.4252 6.74328 16.458 6.81588C16.4907 6.88848 16.5562 6.96108 16.6218 7.03368C16.6873 7.10628 16.7856 7.11528 16.8838 7.11528H17.0148C17.1131 7.11528 17.2441 7.11528 17.3423 7.11528H18.2331C18.397 7.11528 18.528 7.03368 18.5607 6.88278L19.0192 5.30338C19.0192 5.30338 19.0519 5.21608 19.0847 5.09508C19.1175 4.97407 19.1502 4.86207 19.1502 4.71117C19.183 4.56027 19.183 4.40937 19.1502 4.25847C19.1175 4.10757 19.0519 3.95667 18.9537 3.84467C18.8227 3.73267 18.659 3.61167 18.4952 3.52437C18.3314 3.43707 18.1349 3.38247 17.9384 3.35517C17.7419 3.32787 17.5126 3.32787 17.2833 3.32787H17.2178C17.054 3.32787 16.8903 3.35517 16.7265 3.40977C16.5627 3.46437 16.4317 3.51897 16.3007 3.60627C16.1697 3.69357 16.0714 3.78087 15.9732 3.90187C15.8749 4.02287 15.8094 4.14387 15.7439 4.29477C15.7439 4.29477 15.7439 4.29477 15.7439 4.33107C15.7111 4.33107 15.7111 4.36737 15.7111 4.36737C15.6784 4.40367 15.6784 4.43997 15.6456 4.47627C15.6456 4.51257 15.6128 4.58518 15.6128 4.62148C15.5801 4.69408 15.5801 4.76668 15.5801 4.83928C15.5801 4.91188 15.5801 4.98448 15.6128 5.05708C15.6128 5.12968 15.6456 5.20228 15.6784 5.27488C15.7111 5.34748 15.7766 5.42008 15.8422 5.49268C15.9077 5.56528 16.006 5.57427 16.1042 5.57427H16.2352C16.3335 5.57427 16.4645 5.57427 16.5627 5.57427H17.4535C17.6173 5.57427 17.7484 5.49268 17.7811 5.34177L18.2396 3.76238C18.2724 3.61148 18.1741 3.46057 18.0103 3.46057H17.1195C16.9557 3.46057 16.8247 3.54787 16.7919 3.69877L16.4973 5.10526H15.4527C15.2889 5.10526 15.1251 5.23243 15.0596 5.39232L13.5857 12.6358C13.5857 12.7629 13.6512 12.8901 13.782 12.9537C13.8475 13.0172 13.9785 13.0172 14.044 13.0172H15.5834C15.7472 13.0172 15.8782 12.9299 15.9109 12.779L16.3696 11.1996C16.4023 11.0487 16.5333 10.9614 16.6972 10.9614H17.588C17.7518 10.9614 17.8828 10.8741 17.9155 10.7232L18.3743 9.14387C18.407 8.99297 18.538 8.90568 18.7019 8.90568H19.5927C19.7565 8.90568 19.8875 8.81838 19.9202 8.66748L20.379 7.08808C20.4117 6.93718 20.5427 6.84988 20.7065 6.84988H21.5974C21.7612 6.84988 21.8922 6.76258 21.9249 6.61168L22.3837 5.03228C22.4164 4.88138 22.5474 4.79408 22.7112 4.79408H23.602C23.7659 4.79408 23.8969 4.70678 23.9296 4.55588L24.3884 2.97648C24.4211 2.82558 24.5521 2.73828 24.7159 2.73828H25.6067C25.7706 2.73828 25.9016 2.65098 25.9343 2.50008L26.3931 0.920685C26.4258 0.769784 26.3276 0.618882 26.1638 0.618882H25.273C25.1092 0.618882 24.9782 0.70618 24.9454 0.857082L24.4869 2.43648C24.4542 2.58738 24.3232 2.67468 24.1594 2.67468H23.2686C23.1048 2.67468 22.9738 2.76198 22.941 2.91288L22.4826 4.49228C22.4498 4.64318 22.3188 4.73048 22.155 4.73048H21.2642C21.1004 4.73048 20.9694 4.81778 20.9366 4.96868L20.4782 6.54808C20.4454 6.69898 20.3144 6.78628 20.1506 6.78628H19.2598C19.096 6.78628 18.965 6.87358 18.9322 7.02448L18.4738 8.60387C18.441 8.75477 18.31 8.84207 18.1462 8.84207H17.2554C17.0916 8.84207 16.9606 8.92937 16.9278 9.08027L16.4694 10.6597C16.4366 10.8106 16.3056 10.8979 16.1418 10.8979H15.251C15.0872 10.8979 14.9562 10.9852 14.9234 11.1361L14.465 12.7155C14.4322 12.8664 14.3012 12.9537 14.1374 12.9537H13.2466C13.0828 12.9537 12.9518 13.041 12.919 13.1919L12.4606 14.7713C12.4279 14.9222 12.5261 15.0731 12.6899 15.0731H19.9561C20.4799 15.0731 20.9057 14.9459 21.135 14.661C21.3315 14.4088 21.397 14.1567 21.3315 13.8026L19.8576 6.55917C19.8576 6.43207 19.7921 6.30497 19.6613 6.24137C19.5958 6.17777 19.4648 6.17777 19.3993 6.17777H17.8598C17.6959 6.17777 17.5977 6.33767 17.6304 6.48857L18.0561 8.53522C18.5197 9.10251 18.0385 9.42013 17.3444 9.42013H16.4536L16.8467 7.29904H17.7047C18.3988 7.29904 18.7918 7.61665 18.6832 8.53522Z"
        fill="#003087"
      />
    </svg>
  );
}

// Custom Google Pay icon
function GooglePayCheckout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.3545 10.4009V13.5991H20.0482V10.4009H21.3545ZM24 11.9991V10.4009H22.6937V11.9991V13.5973H24V11.9991ZM18.7346 10.4009V13.5991H17.4283V10.4009H18.7346Z"
        fill="#5F6368"
      />
      <path
        d="M16.0864 12.8264C15.7392 13.2882 15.2155 13.5991 14.5918 13.5991C13.3964 13.5991 12.4291 12.6318 12.4291 11.4364C12.4291 10.2409 13.3964 9.27365 14.5918 9.27365C15.2173 9.27365 15.7392 9.58635 16.0846 10.0464L16.0864 10.0482L16.7773 9.35547C16.2555 8.77275 15.4882 8.4 14.5918 8.4C12.9155 8.4 11.5555 9.75824 11.5555 11.4364C11.5555 13.1127 12.9137 14.4727 14.5918 14.4727C15.4882 14.4727 16.2573 14.1 16.7773 13.5173C17.2973 12.9345 17.4864 12.1091 17.4282 11.3836H14.5918V12.2555H16.5991C16.5245 12.4745 16.3337 12.6654 16.0882 12.8245L16.0864 12.8264Z"
        fill="#4285F4"
      />
      <path
        d="M9.6 11.9991C9.6 10.6391 10.44 9.60002 11.5555 9.60002C12.12 9.60002 12.6 9.84002 12.9855 10.2255L13.6855 9.52551C13.0855 8.97551 12.36 8.6582 11.5555 8.6582C9.87999 8.6582 8.52002 10.1018 8.52002 11.9973C8.52002 13.8927 9.87999 15.3364 11.5555 15.3364C12.36 15.3364 13.0855 15.0191 13.6855 14.4709C14.2855 13.9227 14.5855 13.1455 14.5855 12.2509C14.5855 12.0318 14.5673 11.8127 14.5309 11.6127H11.5537V12.6H13.5618C13.4873 13.1836 13.1618 13.7645 12.6818 14.0645C12.3618 14.2855 11.9818 14.4 11.5537 14.4C10.44 14.4 9.6 13.3609 9.6 12.0009V11.9991Z"
        fill="#EA4335"
      />
      <path
        d="M6.37822 12.8455C5.97641 12.5455 5.71822 12.0691 5.71822 11.4364C5.71822 10.8036 5.97641 10.3273 6.37822 10.0273C6.77822 9.72727 7.28731 9.59819 7.82731 9.70182C8.18731 9.77637 8.50002 9.96001 8.73641 10.2145L9.43641 9.51456C9.05459 9.1164 8.55459 8.83275 7.99731 8.71457C7.11822 8.51457 6.21641 8.74185 5.54731 9.29457C4.85459 9.86548 4.4582 10.6345 4.4582 11.4364C4.4582 12.2382 4.85459 13.0073 5.54731 13.5782C6.23823 14.1491 7.21822 14.3764 8.13641 14.1764C8.7382 14.0382 9.27641 13.7055 9.65823 13.2545C10.04 12.8036 10.2582 12.2209 10.2582 11.6182C10.2582 11.3964 10.2382 11.1745 10.1964 10.9564H7.85822V11.8282H9.32731C9.27641 12.1664 9.08368 12.4855 8.81641 12.7145C8.5673 12.9236 8.23822 13.0727 7.88731 13.0727C7.34731 13.0727 6.87641 12.9236 6.37822 12.8455Z"
        fill="#FBBC04"
      />
      <path
        d="M2.4 13.5991V8.4H0V13.5991H2.4Z"
        fill="#34A853"
      />
    </svg>
  );
}

// Custom Apple Pay icon
function ApplePayCheckout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.30111 5.03825C7.91911 4.30825 8.33111 3.28825 8.19311 2.25325C7.30111 2.30425 6.22111 2.86825 5.58511 3.59825C5.02111 4.21625 4.52711 5.28225 4.68311 6.26425C5.66511 6.33325 6.68311 5.77825 7.30111 5.03825Z"
        fill="black"
      />
      <path
        d="M8.19291 6.44707C6.82891 6.37807 5.69291 7.20307 5.05691 7.20307C4.42091 7.20307 3.45691 6.48207 2.40291 6.50007C1.03891 6.51807 -0.20909 7.34307 -0.84509 8.65907C-2.13709 11.3091 -0.31709 15.2471 0.94091 17.2621C1.55891 18.2441 2.30791 19.3441 3.31691 19.2931C4.27191 19.2421 4.66591 18.6601 5.82091 18.6601C6.97591 18.6601 7.33291 19.2931 8.35091 19.2601C9.40491 19.2271 10.0519 18.2441 10.6699 17.2621C11.3879 16.1621 11.6809 15.0981 11.6989 15.0451C11.6809 15.0281 9.91691 14.3271 9.89891 12.2611C9.88091 10.5211 11.2809 9.66207 11.3519 9.60907C10.4959 8.32907 9.12291 8.18207 8.67491 8.13807C7.33291 7.98207 6.12291 8.78007 5.43291 8.78007C4.75091 8.78007 3.73291 6.51807 8.19291 6.44707Z"
        fill="black"
      />
    </svg>
  );
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const useWallet = searchParams.get('payment') === 'wallet';

  const [paymentMethod, setPaymentMethod] = useState<string>(useWallet ? "wallet" : "card");
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiration: "",
    cvv: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [walletStorageKey] = useState(() =>
    isSignedIn && user ? `wallet_${user.id}` : ''
  );
  const [savedWallet, saveWallet] = useLocalStorage<WalletType | null>(
    walletStorageKey,
    null
  );

  // Calculate totals
  const subtotal = cart.total;
  const tax = subtotal * 0.07;
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + tax + shipping;

  // Load wallet data if user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Check if we have a saved wallet first
      if (walletStorageKey && savedWallet) {
        setWallet(savedWallet);
        setIsLoading(false);
      } else {
        // Simulate API call to get wallet
        setIsLoading(true);
        setTimeout(() => {
          const mockWallet = generateMockWallet(user.id);
          setWallet(mockWallet);
          if (walletStorageKey) {
            saveWallet(mockWallet);
          }
          setIsLoading(false);

          // Pre-fill shipping info if available
          if (user.firstName) {
            setShippingAddress(prev => ({
              ...prev,
              fullName: `${user.firstName} ${user.lastName || ""}`.trim()
            }));
          }
        }, 1000);
      }
    } else {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn, user, savedWallet, saveWallet, walletStorageKey]);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/");
    }
  }, [cart.items.length, router]);

  const handleCheckout = () => {
    // Form validation
    if (
      !shippingAddress.fullName ||
      !shippingAddress.streetAddress ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all shipping address fields",
        variant: "destructive",
      });
      return;
    }

    // Credit card validation if using card payment
    if (paymentMethod === "card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.nameOnCard ||
        !cardDetails.expiration ||
        !cardDetails.cvv
      ) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      // If paying with wallet and not enough balance
      if (paymentMethod === "wallet" && wallet && wallet.balance < total) {
        toast({
          title: "Insufficient funds",
          description: "Please top up your wallet or choose a different payment method",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Process payment and create order
      if (paymentMethod === "wallet" && wallet) {
        // Create updated wallet with new balance and transaction
        const updatedWallet = {
          ...wallet,
          balance: Number.parseFloat((wallet.balance - total).toFixed(2)),
          updatedAt: new Date().toISOString(),
          transactions: [
            {
              id: `txn-${Date.now()}`,
              userId: wallet.userId,
              amount: Number.parseFloat((-total).toFixed(2)),
              type: "purchase" as const,
              status: "completed" as const,
              description: `Payment for order #${Math.floor(Math.random() * 1000000)}`,
              createdAt: new Date().toISOString(),
              reference: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
            },
            ...wallet.transactions
          ]
        };

        // Update state and localStorage
        setWallet(updatedWallet);
        if (walletStorageKey) {
          saveWallet(updatedWallet);
        }
      }

      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: `Your order #${Math.floor(Math.random() * 1000000)} has been placed`,
        variant: "success",
      });

      // Clear cart and redirect to order confirmation
      clearCart();
      router.push(`/order-confirmation?method=${paymentMethod}`);

      setIsProcessing(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-gray-100 rounded-lg h-96 animate-pulse" />
            <div className="bg-gray-100 rounded-lg h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const isWalletSufficient = wallet && wallet.balance >= total;

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>
                  Enter your shipping information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input
                      id="streetAddress"
                      value={shippingAddress.streetAddress}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        placeholder="USA"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose how you'd like to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="card" className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      <span className="hidden sm:inline">Card</span>
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="flex items-center gap-1">
                      <PaypalIconCheckout className="h-4 w-4" />
                      <span className="hidden sm:inline">PayPal</span>
                    </TabsTrigger>
                    <TabsTrigger value="apple" className="flex items-center gap-1">
                      <ApplePayCheckout className="h-4 w-4" />
                      <span className="hidden sm:inline">Apple Pay</span>
                    </TabsTrigger>
                    <TabsTrigger value="google" className="flex items-center gap-1">
                      <GooglePayCheckout className="h-4 w-4" />
                      <span className="hidden sm:inline">Google Pay</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="wallet"
                      disabled={!isSignedIn || !wallet}
                      className="flex items-center gap-1"
                    >
                      <Wallet className="h-4 w-4" />
                      <span className="hidden sm:inline">Wallet</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          placeholder="4242 4242 4242 4242"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          value={cardDetails.nameOnCard}
                          onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiration">Expiration (MM/YY)</Label>
                          <Input
                            id="expiration"
                            value={cardDetails.expiration}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiration: e.target.value })}
                            placeholder="12/25"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">Security Code</Label>
                          <Input
                            id="cvv"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal">
                    <div className="text-center py-8">
                      <PaypalIconCheckout className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You'll be redirected to PayPal to complete your purchase securely.
                      </p>
                      <Button className="bg-[#0070BA] hover:bg-[#005ea6] text-white">
                        Continue with PayPal
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="apple">
                    <div className="text-center py-8">
                      <ApplePayCheckout className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Complete your purchase with Apple Pay for a faster checkout.
                      </p>
                      <Button className="bg-black hover:bg-gray-800 text-white">
                        Continue with Apple Pay
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="google">
                    <div className="text-center py-8">
                      <GooglePayCheckout className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Complete your purchase with Google Pay for a faster checkout.
                      </p>
                      <Button className="bg-white hover:bg-gray-100 text-black border border-gray-300">
                        Continue with Google Pay
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="wallet">
                    {wallet && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <h3 className="font-medium">Wallet Balance</h3>
                            <p className="text-sm text-muted-foreground">
                              Your current wallet balance
                            </p>
                          </div>
                          <div className="text-lg font-bold">
                            ${wallet.balance.toFixed(2)}
                          </div>
                        </div>

                        {isWalletSufficient ? (
                          <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-200">
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                            <div>
                              <p className="text-sm text-green-700">
                                You have sufficient funds to complete this purchase
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                After this purchase, your remaining balance will be ${(wallet.balance - total).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                            <div>
                              <p className="text-sm text-yellow-700">
                                Insufficient funds. You need ${(total - wallet.balance).toFixed(2)} more.
                              </p>
                              <Button
                                size="sm"
                                className="mt-2 bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
                                onClick={() => router.push("/profile?tab=wallet")}
                              >
                                Top Up Wallet
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <Info className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-blue-700">
                              Using your wallet balance is quick, secure, and helps you track spending.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center">
                          {item.quantity}
                        </Badge>
                        <span className="text-sm truncate max-w-[160px]">
                          {item.product.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {paymentMethod === "wallet" && wallet && !isWalletSufficient && (
                  <div className="flex items-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <p className="text-xs text-yellow-700">
                      Insufficient wallet balance. Please top up or select a different payment method.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
                  onClick={handleCheckout}
                  disabled={
                    isProcessing ||
                    (paymentMethod === "wallet" && (!wallet || !isWalletSufficient))
                  }
                >
                  {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
