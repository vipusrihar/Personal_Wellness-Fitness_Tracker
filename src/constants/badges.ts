import type { Badge } from "../types/Badge";
import { FiTarget, FiTrendingDown, FiAward, FiZap, FiDroplet, FiActivity } from "react-icons/fi";
import { GiWeightLiftingUp } from "react-icons/gi";
import { MdLocalFireDepartment } from "react-icons/md";

export const BADGES: Badge[] = [

    {
        id: "first_login",
        label: "First Steps",
        icon: FiActivity,
        desc: "Logged in for the first time"
    },

    {
        id: "first_workout",
        label: "Iron Will",
        icon: GiWeightLiftingUp,
        desc: "Completed your first workout"
    },

    {
        id: "first_meal",
        label: "Fuel Up",
        icon: FiActivity,
        desc: "Logged your first meal"
    },

    {
        id: "hydration_goal",
        label: "Hydrated",
        icon: FiDroplet,
        desc: "Met daily water goal"
    },

    {
        id: "streak_3",
        label: "On Fire",
        icon: MdLocalFireDepartment,
        desc: "3-day streak"
    },

    {
        id: "streak_7",
        label: "Week Warrior",
        icon: FiZap,
        desc: "7-day streak"
    },

    {
        id: "streak_30",
        label: "Legend",
        icon: FiAward,
        desc: "30-day streak"
    },

    {
        id: "weight_loss",
        label: "Slimmer",
        icon: FiTrendingDown,
        desc: "Logged weight loss progress"
    },

    {
        id: "calorie_goal",
        label: "Disciplined",
        icon: FiTarget,
        desc: "Hit calorie goal 3 times"
    }

]