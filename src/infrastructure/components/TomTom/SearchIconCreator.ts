export class SearchIconCreator {
    color: string;
    poiData: any;

    constructor (color: string, poiData: any) {
        this.color = color;
        this.poiData = poiData;
    }

    getIcon = () => {
        const classification = this.poiData.classification;
        let iconClass = this.availableIcons.fallback;
    
        if (this.poiData.classification) {
            var icon;
    
            if (Array.isArray(classification)) {
                var iconName =
                    classification.indexOf("hospital/polyclinic") > -1
                        ? "HOSPITAL_POLYCLINIC"
                        : classification.length > 1
                        ? classification[1].toUpperCase()
                        : classification[0].toUpperCase();
    
                icon = this.availableIcons[iconName];
            } else {
                icon = this.availableIcons[classification];
            }
            if (icon) {
                iconClass = icon;
            }
        }
    
        const modifier = this.getIconClassModifier(iconClass);
        if (modifier && this.isColorModifier(modifier)) {
            return (
                "tt-icon-" +
                this.getIconClassWithoutModifier(iconClass) +
                "-" +
                this.color
            );
        }
    
        return "tt-icon-" + iconClass;
    }

    getIconClassModifier = (iconClass: string) => {
        const classParts = iconClass.split("-");
        return classParts.length > -1 ? classParts.slice(-1)[0] : undefined;
    }

    isColorModifier = (modifier: string) => {
        return ["white", "black"].indexOf(modifier) > -1;
    }

    getIconClassWithoutModifier = (iconClass: string) => {
        return iconClass.split("-").slice(0, -1).join("-");
    };
    
    availableIcons: {[k: string]: string} = {
        fallback: "flag-white",
        ACCESS_GATEWAY: "ic_map_poi_110-white",
        ADMINISTRATIVE_DIVISION: "ic_map_poi_133-white",
        ADVENTURE_SPORTS_VENUE: "ic_map_poi_122-white",
        AGRICULTURAL_BUSSINESS: "ic_map_poi_107-white",
        AGRICULTURE: "ic_map_poi_107-white",
        AIRPORT: "ic_map_poi_007-white",
        AMUSEMENT_PARK: "ic_map_poi_051-white",
        AUTOMOTIVE_DEALER: "ic_map_poi_008-white",
        BANK: "ic_map_poi_077-white",
        BAR_PUB: "ic_map_poi_120-white",
        BEACH: "ic_map_poi_043-white",
        BEAUTY_SALON: "ic_map_poi_066-white",
        BUILDING_POINT: "ic_map_poi_132-white",
        BUS_STATION: "ic_map_poi_069-white",
        BUSINESS_PARK: "ic_map_poi_102-white",
        CAFE_PUB: "ic_map_poi_120-white",
        CAMPING_GROUND: "ic_map_poi_058-white",
        CAR_DEALER: "ic_map_poi_008-white",
        CAR_WASH: "ic_map_poi_067-white",
        CASH_DISPENSER: "ic_map_poi_042-white",
        CASINO: "ic_map_poi_009-white",
        CINEMA: "ic_map_poi_011-white",
        CITY_CENTER: "ic_map_poi_012-white",
        CLUB_ASSOCIATION: "ic_map_poi_131-white",
        COLLEGE_UNIVERSITY: "ic_map_poi_041-white",
        COMMERCIAL_BUILDING: "ic_map_poi_098-white",
        COMMUNITY_CENTER: "ic_map_poi_081-white",
        COMPANY: "ic_map_poi_013-white",
        CONVENIENCE_STORE: "ic_map_poi_080-white",
        COURTHOUSE: "ic_map_poi_015-white",
        CULTURAL_CENTER: "ic_map_poi_016-white",
        DENTIST: "ic_map_poi_048-white",
        DEPARTMENT_STORE: "ic_map_poi_104-white",
        DOCTOR: "ic_map_poi_047-white",
        ECONOMIC_CHAIN_HOTEL: "ic_map_poi_083-white",
        ELECTRIC_VEHICLE_STATION: "ic_map_poi_073-white",
        EMBASSY: "ic_map_poi_040-white",
        EMERGENCY_MEDICAL_SERVICE: "ic_map_poi_115-white",
        ENTERTAINMENT: "ic_map_poi_035-white",
        ENTRY_POINT: "ic_map_poi_109-white",
        EXCHANGE: "ic_map_poi_096-white",
        EXHIBITION_CENTER: "ic_map_poi_017-white",
        EXHIBITION_CONVENTION_CENTER: "ic_map_poi_017-white",
        FERRY_TERMINAL: "ic_map_poi_018-white",
        FINANCIAL_INSTITUTION: "ic_map_poi_077-white",
        FIRE_STATION_BRIGADE: "ic_map_poi_068-white",
        FRONTIER_CROSSING: "ic_map_poi_019-white",
        FUEL_FACILITIES: "ic_map_poi_004-white",
        GEOGRAPHIC_FEATURE: "ic_map_poi_127-white",
        GOLF_COURSE: "ic_map_poi_020-white",
        GOVERNMENT_OFFICE: "ic_map_poi_000-white",
        HEALTH_CARE_SERVICE: "ic_map_poi_116-white",
        HELIPAD_HELICOPTER_LANDING: "ic_map_poi_123-white",
        HOLIDAY_RENTAL: "ic_map_poi_130-white",
        HOSPITAL_POLYCLINIC: "ic_map_poi_021-white",
        HOTEL_MOTEL: "ic_map_poi_022-white",
        ICE_SKATING_RINK: "ic_map_poi_044-white",
        IMPORTANT_TOURIST_ATTRACTION: "ic_map_poi_023-white",
        INDUSTRIAL_AREA: "ic_map_poi_095-white",
        INDUSTRIAL_BUILDING: "ic_map_poi_095-white",
        LEGAL_SOLICIDORS: "ic_map_poi_064-white",
        LEISURE_CENTER: "ic_map_poi_061-white",
        LIBRARY: "ic_map_poi_052-white",
        LUXURY_HOTEL: "ic_map_poi_078-white",
        MANUFACTURING_FACILITY: "ic_map_poi_099-white",
        MARINA: "ic_map_poi_062-white",
        MARKET: "ic_map_poi_118-white",
        MEDIA_FACILITY: "ic_map_poi_101-white",
        MILITARY_INSTALLATION: "ic_map_poi_106-white",
        MOTORING_ORGANIZATION_OFFICE: "ic_map_poi_076-white",
        MOUNTAIN_PASS: "ic_map_poi_024-white",
        MOUNTAIN_PEAK: "ic_map_poi_001-white",
        MUSEUM: "ic_map_poi_025-white",
        NATIVE_RESERVATION: "ic_map_poi_125-white",
        NIGHTLIFE: "ic_map_poi_050-white",
        NON_GOVERNMENTAL_ORGANIZATION: "ic_map_poi_134-white",
        OPEN_PARKING_AREA: "ic_map_poi_002",
        OPERA: "ic_map_poi_026-white",
        OTHER: "flag-white",
        PARKING_GARAGE: "ic_map_poi_003",
        PARK_RECREATION_AREA: "ic_map_poi_059-white",
        PET_SERVICES: "ic_map_poi_085-white",
        PETROL_STATION: "ic_map_poi_004-white",
        PHARMACY: "ic_map_poi_054-white",
        PLACE_OF_WORSHIP: "ic_map_poi_027-white",
        PLAYING_FIELD: "ic_map_poi_072-white",
        POLICE_STATION: "ic_map_poi_039-white",
        PORT_WAREHOUSE_FACILITY: "ic_map_poi_105-white",
        POST_OFFICE: "ic_map_poi_028-white",
        PRIMARY_RESOURCE_FACILITY: "ic_map_poi_108-white",
        PRIMARY_RESOURCE_UTILITY: "ic_map_poi_108-white",
        PRISON_CORRECTIONAL_FACILITY: "ic_map_poi_094-white",
        PUBLIC_AMENITY: "ic_map_poi_097-white",
        PUBLIC_TRANSPORT_STOP: "ic_map_poi_069-white",
        RAILWAY_STATION: "ic_map_poi_005-white",
        RENT_A_CAR_FACILITY: "ic_map_poi_029-white",
        RENT_A_CAR_PARKING: "ic_map_poi_030",
        REPAIR_FACILITY: "ic_map_poi_053-white",
        RESEARCH_FACILITY: "ic_map_poi_100-white",
        RESIDENTIAL_ACCOMMODATION: "ic_map_poi_075-white",
        RESIDENTIAL_AREA: "ic_map_poi_103-white",
        RESTAURANT: "ic_map_poi_031-white",
        RESTAURANT_AREA: "ic_map_poi_031-white",
        RESTAURANT_CHINESE: "ic_map_poi_079-white",
        REST_AREA: "ic_map_poi_006-white",
        SCENIC_PANORAMIC_VIEW: "ic_map_poi_055-white",
        SCHOOL: "ic_map_poi_070-white",
        SHOP: "ic_map_poi_032-white",
        SHOPPING_CENTER: "ic_map_poi_033-white",
        SPORTS_CENTER: "ic_map_poi_038-white",
        STADIUM: "ic_map_poi_034-white",
        SWIMMING_POOL: "ic_map_poi_046-white",
        TELE_COMMUNICATIONS: "ic_map_poi_082-white",
        TENNIS_COURT: "ic_map_poi_045-white",
        THEATER: "ic_map_poi_035-white",
        TOURIST_INFORMATION_OFFICE: "ic_map_poi_023-white",
        TRAFFIC_LIGHT: "ic_map_poi_129-white",
        TRAFFIC_SERVICE_CENTER: "ic_map_poi_126-white",
        TRAFFIC_SIGN: "ic_map_poi_128-white",
        TRAIL_SYSTEM: "ic_map_poi_124-white",
        TRANSPORT_AUTHORITY_VEHICLE_REGISTRATION: "ic_map_poi_113-white",
        TRUCK_STOP: "ic_map_poi_071",
        VETERINARIAN: "ic_map_poi_049-white",
        WATER_SPORT: "ic_map_poi_046-white",
        WEIGH_STATION: "ic_map_poi_111-white",
        WELFARE_ORGANIZATION: "ic_map_poi_117-white",
        WINERY: "ic_map_poi_057-white",
        YACHT_BASIN: "ic_map_poi_062-white",
        ZOOS_ARBORETA_BOTANICAL_GARDEN: "ic_map_poi_037",
    }
}
