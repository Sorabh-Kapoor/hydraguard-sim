import { useState, useRef } from 'react';
import { Upload, Users, FileText, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHydraX } from '@/contexts/HydraXContext';
import { useToast } from '@/hooks/use-toast';

export const AdminPanel = () => {
  const { currentUser, wordlist, setWordlist, targetAccounts, setTargetAccounts } = useHydraX();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <Card variant="glass" className="border-warning/30">
        <CardContent className="flex items-center justify-center h-48 gap-3">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <span className="text-warning">Admin access required</span>
        </CardContent>
      </Card>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const words = text.split(/[\r\n,]+/).map(w => w.trim()).filter(Boolean);
      setWordlist(words);
      toast({
        title: 'Wordlist Uploaded',
        description: `Loaded ${words.length} entries`,
      });
    };
    reader.readAsText(file);
  };

  const addTargetAccount = () => {
    if (!newUsername || !newPassword) return;
    
    setTargetAccounts([
      ...targetAccounts,
      {
        id: Math.random().toString(36).substr(2, 9),
        username: newUsername,
        password: newPassword,
        isActive: true,
      },
    ]);
    setNewUsername('');
    setNewPassword('');
    toast({ title: 'Account Added', description: `Target account "${newUsername}" created` });
  };

  const removeAccount = (id: string) => {
    setTargetAccounts(targetAccounts.filter(a => a.id !== id));
    toast({ title: 'Account Removed' });
  };

  return (
    <Card variant="cyber">
      <CardHeader className="border-b border-primary/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Admin Control Panel
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs defaultValue="wordlist">
          <TabsList className="w-full bg-secondary/50">
            <TabsTrigger value="wordlist" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Wordlist
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Accounts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wordlist" className="space-y-4 mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.csv"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Wordlist (TXT/CSV)
            </Button>

            <div className="p-3 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Current wordlist: <span className="text-primary">{wordlist.length}</span> entries
              </p>
              <div className="max-h-32 overflow-y-auto text-xs font-mono space-y-1">
                {wordlist.slice(0, 20).map((word, i) => (
                  <span key={i} className="inline-block px-2 py-0.5 bg-background rounded mr-1 mb-1">
                    {word}
                  </span>
                ))}
                {wordlist.length > 20 && (
                  <span className="text-muted-foreground">...and {wordlist.length - 20} more</span>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addTargetAccount} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {targetAccounts.map(account => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border"
                >
                  <div>
                    <span className="text-sm font-mono">{account.username}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({account.password.replace(/./g, '•')})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAccount(account.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
