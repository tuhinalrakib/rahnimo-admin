"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@mui/material";
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import { FaEnvelopeOpenText, FaUserPlus, FaUsers } from "react-icons/fa";;
import { MdProductionQuantityLimits } from "react-icons/md";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";
import CardSkeleton from "../UiSkeleton/CardSkeleton";

const StatsCards = () => {
  // const { data: totalProduct = 0, isLoading: loadingProducts } = useQuery({
  //   queryKey: ["totalProducts"],
  //   queryFn: async () => {
  //     const res = await api.get('/admin/products/productsCount');
  //     return res.data;
  //   }
  // });

  const { data: totalUsers = 0, isLoading: loadingUsers } = useQuery({
    queryKey: ["totalUsers"],
    queryFn: async () => {
      const res = await api.get('/admin/users/usersCount');
      return res.data;
    }
  });

  const isLoading = /*loadingProducts ||*/ loadingUsers;

  if (isLoading) return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );

  const cardsData = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FaUsers size={28} />,
      link: "/dashboard/manageUsers",
      buttonText: "View Details"
    },
    {
      title: "Total Projects",
      // value: totalProduct,
      value: 5,
      icon: <MdProductionQuantityLimits size={28} />,
      link: "/dashboard/manageProducts",
      buttonText: "View Details"
    },
    {
      title: "Total Team Member",
      value: 7,
      icon: <FaUserPlus size={28} />,
      link: null,
      buttonText: "View Tickets",
      buttonIcon: <FaEnvelopeOpenText size={20} />
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cardsData.map((card, idx) => (
        <Card
          key={idx}
          className="
            bg-white/80 backdrop-blur-md border border-gray-200
            rounded-3xl shadow-md hover:shadow-xl transition-all duration-300
            flex flex-col justify-between
          "
        >
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              {card.title}
            </CardTitle>
            <Badge variant="secondary" className="p-3 rounded-full bg-gray-100">
              {card.icon}
            </Badge>
          </CardHeader>

          <CardContent className="pb-4">
            <div className="text-3xl font-bold text-gray-800">{card.value}</div>
          </CardContent>

          <CardFooter className="pt-2">
            {card.link ? (
              <Link href={card.link}>
                <Button
                  variant="contained"
                  startIcon={<InfoSharpIcon />}
                  sx={{ borderRadius: "12px", textTransform: "none" }}
                >
                  {card.buttonText}
                </Button>
              </Link>
            ) : (
              <Button
                variant="contained"
                startIcon={card.buttonIcon || <InfoSharpIcon />}
                sx={{ borderRadius: "12px", textTransform: "none" }}
              >
                {card.buttonText}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
