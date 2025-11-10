import { LucideProps } from "lucide-react"

export type IconType = {
    icon : React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >
}