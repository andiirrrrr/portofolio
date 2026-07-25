import {
    SiReact,
    SiLaravel,
    SiNextdotjs,
    SiNodedotjs,
    SiPython,
    SiPhp,
    SiMysql,
    SiPostgresql,
    SiMongodb,
    SiDocker,
    SiKubernetes,
    SiGit,
    SiLinux,
    SiTailwindcss,
    SiHtml5,
    SiJavascript,
    SiTypescript,
    SiVuedotjs,
    SiAngular,
    SiFlutter,
    SiSwift,
    SiKotlin,
    SiFirebase,
    SiRedis,
    SiElasticsearch,
    SiGraphql,
    SiApollographql,
    SiWebpack,
    SiBabel,
    SiJest,
    SiCypress,
    SiJenkins,
    SiGithubactions,
    SiTerraform,
    SiAnsible,
    SiPrometheus,
    SiGrafana,
    SiNginx,
    SiApache,
    SiCloudflare,
    SiDigitalocean,
    SiVercel,
    SiNetlify,
    SiRailway,
    SiSupabase,
    SiPrisma,
    SiSequelize,
    SiMongoose,
    SiPassport,
    SiSocketdotio,
    SiWebrtc,
    SiWebassembly,
    SiRust,
    SiGo,
    SiRuby,
    SiDjango,
    SiFlask,
    SiFastapi,
    SiSpring,
    SiHibernate,
    SiDotnet,
    SiUnity,
    SiUnrealengine,
    SiGodotengine,
} from 'react-icons/si';
import { FaCode, FaDatabase, FaServer, FaCloud, FaTools, FaPaintBrush, FaMobileAlt, FaLaptopCode } from 'react-icons/fa';

// Mapping nama skill ke icon
export const skillIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    // Frontend
    'react': SiReact,
    'react.js': SiReact,
    'next': SiNextdotjs,
    'next.js': SiNextdotjs,
    'vue': SiVuedotjs,
    'vue.js': SiVuedotjs,
    'angular': SiAngular,
    'flutter': SiFlutter,
    'swift': SiSwift,
    'kotlin': SiKotlin,
    'html': SiHtml5,
    'html5': SiHtml5,
    'tailwind': SiTailwindcss,
    'tailwind css': SiTailwindcss,
    'javascript': SiJavascript,
    'js': SiJavascript,
    'typescript': SiTypescript,
    'ts': SiTypescript,

    // Backend
    'laravel': SiLaravel,
    'php': SiPhp,
    'node': SiNodedotjs,
    'node.js': SiNodedotjs,
    'python': SiPython,
    'django': SiDjango,
    'flask': SiFlask,
    'fastapi': SiFastapi,
    'spring': SiSpring,
    'spring boot': SiSpring,
    'ruby': SiRuby,
    'go': SiGo,
    'rust': SiRust,
    '.net': SiDotnet,

    // Database
    'mysql': SiMysql,
    'postgresql': SiPostgresql,
    'postgres': SiPostgresql,
    'mongodb': SiMongodb,
    'mongo': SiMongodb,
    'redis': SiRedis,
    'firebase': SiFirebase,
    'supabase': SiSupabase,
    'elasticsearch': SiElasticsearch,
    'elastic': SiElasticsearch,

    // ORM / Tools
    'prisma': SiPrisma,
    'sequelize': SiSequelize,
    'mongoose': SiMongoose,

    // DevOps
    'docker': SiDocker,
    'kubernetes': SiKubernetes,
    'k8s': SiKubernetes,
    'cloud': SiCloudflare,
    'digitalocean': SiDigitalocean,
    'vercel': SiVercel,
    'netlify': SiNetlify,
    'nginx': SiNginx,
    'apache': SiApache,
    'jenkins': SiJenkins,
    'github actions': SiGithubactions,
    'terraform': SiTerraform,
    'ansible': SiAnsible,

    // Version Control
    'git': SiGit,
    'github': SiGit,
    'gitlab': SiGit,

    // Monitoring
    'prometheus': SiPrometheus,
    'grafana': SiGrafana,

    // Other
    'linux': SiLinux,
    'webpack': SiWebpack,
    'babel': SiBabel,
    'jest': SiJest,
    'cypress': SiCypress,
    'graphql': SiGraphql,
    'apollo': SiApollographql,
    'passport': SiPassport,
    'socket.io': SiSocketdotio,
    'webrtc': SiWebrtc,
    'webassembly': SiWebassembly,
    'unity': SiUnity,
    'unreal': SiUnrealengine,
    'godot': SiGodotengine,
};

// Default icon jika tidak ada mapping
export const DefaultIcon = FaCode;

export function getSkillIcon(skillName: string): React.ComponentType<{ className?: string }> {
    const lower = skillName.toLowerCase().trim();

    // Coba cari mapping exact match
    if (skillIconMap[lower]) return skillIconMap[lower];

    // Coba cari partial match
    for (const [key, icon] of Object.entries(skillIconMap)) {
        if (lower.includes(key)) return icon;
    }

    // Fallback berdasarkan kategori
    if (lower.includes('database') || lower.includes('sql')) return FaDatabase;
    if (lower.includes('server') || lower.includes('api')) return FaServer;
    if (lower.includes('cloud')) return FaCloud;
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return FaPaintBrush;
    if (lower.includes('mobile')) return FaMobileAlt;
    if (lower.includes('tool')) return FaTools;

    return FaLaptopCode;
}