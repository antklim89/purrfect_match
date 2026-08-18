import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Skeleton } from '@/shared/ui/skeleton';

export function ProfileUpdateFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User's Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {Array.from({ length: 5 }, (_, i) => (
            <Field key={i}>
              <FieldLabel>
                <Skeleton className="w-48 h-6" />
              </FieldLabel>
              <Skeleton className="w-full h-11" />
            </Field>
          ))}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
