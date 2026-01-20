import { UserType } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Users, Briefcase } from 'lucide-react';

interface UserTypeSelectorProps {
    selectedType: UserType;
    onTypeChange: (type: UserType) => void;
}

export default function UserTypeSelector({ selectedType, onTypeChange }: UserTypeSelectorProps) {
    return (
        <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
            <Button
                type="button"
                variant={selectedType === 'boss' ? 'default' : 'ghost'}
                className={`flex-1 gap-2 transition-all border-0 ${selectedType === 'boss'
                        ? 'shadow-sm'
                        : 'hover:bg-gray-100'
                    }`}
                style={{
                    backgroundColor: selectedType === 'boss' ? 'hsl(168, 75%, 21%)' : 'transparent',
                    color: selectedType === 'boss' ? 'white' : 'hsl(168, 20%, 45%)'
                }}
                onClick={() => onTypeChange('boss')}
            >
                <Briefcase className="w-4 h-4" />
                Jefe
            </Button>
            <Button
                type="button"
                variant={selectedType === 'employee' ? 'default' : 'ghost'}
                className={`flex-1 gap-2 transition-all border-0 ${selectedType === 'employee'
                        ? 'shadow-sm'
                        : 'hover:bg-gray-100'
                    }`}
                style={{
                    backgroundColor: selectedType === 'employee' ? 'hsl(168, 75%, 21%)' : 'transparent',
                    color: selectedType === 'employee' ? 'white' : 'hsl(168, 20%, 45%)'
                }}
                onClick={() => onTypeChange('employee')}
            >
                <Users className="w-4 h-4" />
                Empleado
            </Button>
        </div>
    );
}
